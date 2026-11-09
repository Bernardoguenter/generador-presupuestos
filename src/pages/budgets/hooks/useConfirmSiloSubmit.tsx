import { useCallback, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router";
import {
  CreateBudgetToastError,
  CreateBudgetToastSuccess,
  UpdateBudgetToastError,
  UpdateBudgetToastSuccess,
} from "@/utils/alerts";
import {
  buildPDFFromElement,
  canShareRemecoPDF,
  companyHasRenders,
  convertPDF,
  getSiloPDFImages,
  prepareSiloPDF,
  shareRemecoPDF,
  waitNextFrame,
  type PreparedRemecoPDF,
} from "@/helpers";
import { paymentMethods } from "@/helpers";
import { getDefaultCaption, getSilosDescriptions, priceInUSD } from "@/helpers";
import {
  calculateFreightArsPriceWithTaxesAndMarkup,
  getIndividualSiloPrices,
  getSilosPricestArsPriceWithTaxesAndMarkup,
} from "@/helpers";
import {
  ConfirmSiloPDFSchema,
  type ConfirmSiloPDFFormData,
} from "@/pages/budgets/schema";
import type { PDFImage, Silo, SiloBudget, SiloPDFInfo } from "@/types";
import {
  useCompanyContext,
  usePDFContext,
  usePreferencesContext,
} from "@/common/context";
import { updateBudget, createBudget } from "@/common/lib";

interface UseConfirmSiloSubmitProps {
  getBudget?: (id: string, type: "silo" | "structure") => void;
  handleView?: () => void;
}

export const useConfirmSiloSubmit = ({
  getBudget,
  handleView,
}: UseConfirmSiloSubmitProps) => {
  const { id } = useParams();
  const { pdfInfo, setPdfInfo, setShowPDF } = usePDFContext();
  const { preferences } = usePreferencesContext();
  const [viewPdf, setViewPdf] = useState<boolean>(false);
  const [budget, setBudget] = useState<SiloBudget | null>(null);
  const navigate = useNavigate();
  const { company } = useCompanyContext();
  const isRemeco = companyHasRenders(company?.company_name);

  // PDF armado de antemano (en el celular), para que al tocar "Confirmar
  // Presupuesto" se abra directo el menú de compartir, igual que en galpones.
  const draftKeyRef = useRef<string | null>(null);
  const preparedRef = useRef<{ key: string; pdf: PreparedRemecoPDF } | null>(null);
  const imagesRef = useRef<{ key: string; promise: Promise<PDFImage[]> } | null>(null);

  const getImages = (silos: Silo[]) => {
    const key = JSON.stringify(silos);
    if (imagesRef.current?.key !== key)
      imagesRef.current = { key, promise: getSiloPDFImages(silos) };
    return imagesRef.current.promise;
  };

  const handleDownloadPdf = async (
    customer: string,
    silos: Silo[],
    isNew: boolean,
  ) => {
    setViewPdf(true);
    await waitNextFrame();
    await waitNextFrame();
    const images = await getImages(silos);

    const element = document.getElementById("pdf");
    if (isRemeco && element && canShareRemecoPDF()) {
      const doc = await buildPDFFromElement(element, images);
      await shareRemecoPDF(prepareSiloPDF(doc, silos, customer));
    } else {
      convertPDF(customer, images);
    }

    finishView(isNew);
  };

  const finishView = (isNew: boolean) => {
    setTimeout(() => {
      setViewPdf(false);
      setPdfInfo(null);
      setShowPDF(false);
      if (isNew) {
        navigate("/budgets/calculator");
      }
    }, 1000);
  };

  const buildSubmitData = (formData: ConfirmSiloPDFFormData) => {
    const { dataToSubmit } = pdfInfo as SiloPDFInfo;
    const {
      includes_taxes,
      paymentMethods: _paymentMethods,
      description: _description,
      estimatedDelivery: _estimatedDelivery,
      freight_price: _freight_price,
      totals: _totals,
      total: _total,
      caption: _caption,
      created_by,
      ...restDataToSubmit
    } = dataToSubmit;

    const description = [...(formData.description ?? [])];
    if (formData.extra_product !== "" && formData.extra_product) {
      description.push(formData.extra_product);
    }

    const descriptionString = description.join("; ");

    const budgetSubmitData = {
      ...restDataToSubmit,
      includes_taxes,
      paymentMethods: formData.paymentMethods,
      description: descriptionString,
      estimatedDelivery: formData.estimatedDelivery,
      freight_price:
        formData.freight_price /
        (1 + dataToSubmit.budget_markup / 100) /
        preferences.dollar_quote,
      totals: {
        silos: (formData?.silosPrices ?? []).map((silo) => {
          const totalPrice = priceInUSD(
            silo,
            preferences.dollar_quote,
            preferences.default_markup,
            dataToSubmit.budget_markup,
          );
          return includes_taxes
            ? totalPrice
            : (totalPrice * (100 - preferences.iva_percentage)) / 100;
        }),
        freight_price: priceInUSD(
          formData.freight_price,
          preferences.dollar_quote,
          preferences.default_markup,
          dataToSubmit.budget_markup,
        ),
        extra_product_price: formData.extra_product_price
          ? priceInUSD(
              formData.extra_product_price,
              preferences.dollar_quote,
              preferences.default_markup,
              dataToSubmit.budget_markup,
            )
          : 0,
        total: priceInUSD(
          formData.total,
          preferences.dollar_quote,
          preferences.default_markup,
          dataToSubmit.budget_markup,
        ),
      },
      total: priceInUSD(
        formData.total,
        preferences.dollar_quote,
        preferences.default_markup,
        dataToSubmit.budget_markup,
      ),
      caption: formData.caption,
      created_by: typeof created_by === "object" ? created_by.id : created_by,
    };

    return budgetSubmitData;
  };

  /**
   * Borrador del presupuesto para armar el PDF de antemano (se dibuja oculto
   * en la página). Devuelve null si no hace falta.
   */
  const buildDraft = useCallback(
    (values: unknown): { key: string; budget: SiloBudget } | "ready" | "pending" => {
      if (!isRemeco || !pdfInfo || !canShareRemecoPDF()) return "ready";
      const parsed = ConfirmSiloPDFSchema.safeParse(values);
      if (!parsed.success) return "ready";
      const key = JSON.stringify(parsed.data);
      if (preparedRef.current?.key === key) return "ready";
      if (draftKeyRef.current === key) return "pending";
      draftKeyRef.current = key;
      const budget = {
        ...buildSubmitData(parsed.data),
        id: id ?? "",
        created_at: new Date().toISOString(),
      } as unknown as SiloBudget;
      return { key, budget };
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isRemeco, pdfInfo, preferences, id],
  );

  /** Se llama cuando el borrador ya está dibujado (oculto) en la página. */
  const onDraftRendered = useCallback(
    async (element: HTMLElement, key: string, budget: SiloBudget): Promise<boolean> => {
      try {
        await waitNextFrame();
        await waitNextFrame();
        const images = await getImages(budget.silos as unknown as Silo[]);
        const doc = await buildPDFFromElement(element, images);
        if (draftKeyRef.current !== key) return false;
        preparedRef.current = {
          key,
          pdf: prepareSiloPDF(doc, budget.silos as unknown as Silo[], budget.customer),
        };
        return true;
      } catch (error) {
        console.error("No se pudo armar el PDF de antemano", error);
        return draftKeyRef.current === key;
      }
    },
    [],
  );

  const handleSubmit = async (formData: ConfirmSiloPDFFormData) => {
    if (!pdfInfo) return;

    // Si el PDF ya está armado con estos datos, se comparte en el mismo toque.
    const ready =
      isRemeco && preparedRef.current?.key === JSON.stringify(formData)
        ? preparedRef.current.pdf
        : null;
    if (ready) void shareRemecoPDF(ready);

    const budgetSubmitData = buildSubmitData(formData);

    const { data, error } = id
      ? await updateBudget(budgetSubmitData, id, "silo")
      : await createBudget(budgetSubmitData, "silo");

    if (!error && !id) {
      if (data.id) {
        setBudget(data);
        if (ready) finishView(true);
        else handleDownloadPdf(data.customer, data.silos, true);
        CreateBudgetToastSuccess();
      }
    } else if (!error && id) {
      setViewPdf(true);

      if (ready) finishView(false);
      else handleDownloadPdf(data.customer, data.silos, false);
      UpdateBudgetToastSuccess();

      if (getBudget) {
        getBudget(id, "silo");
      }
      if (handleView) {
        handleView();
      }
    } else if (error && !id) {
      CreateBudgetToastError();
    } else if (error && id) {
      UpdateBudgetToastError();
    }
  };

  const getSiloDefaultValues = () => {
    if (!pdfInfo) return null;

    const { dataToSubmit } = pdfInfo as SiloPDFInfo;
    const { includes_freight, freight_price, includes_taxes } = dataToSubmit;

    const defaultDescription = getSilosDescriptions(dataToSubmit.silos);

    const defaultCaption = getDefaultCaption(
      includes_freight,
      includes_taxes,
      preferences.iva_percentage,
      "silo",
    );

    const silosPricesFromPreferences = getIndividualSiloPrices(
      dataToSubmit.silos,
      preferences,
    );

    const silosPricesList = getSilosPricestArsPriceWithTaxesAndMarkup(
      silosPricesFromPreferences,
      preferences.dollar_quote,
      preferences.default_markup,
      dataToSubmit.budget_markup,
      includes_taxes,
      preferences.iva_percentage,
    );

    const newFreightPrice = calculateFreightArsPriceWithTaxesAndMarkup(
      freight_price,
      preferences.dollar_quote,
      preferences.default_markup,
      dataToSubmit.budget_markup,
      includes_taxes,
      preferences.iva_percentage,
    );

    const totalARS = silosPricesList.reduce(
      (sum, acc) => sum + acc,
      newFreightPrice,
    );

    return {
      description: defaultDescription,
      paymentMethods: paymentMethods["Silo"],
      total: totalARS,
      caption: defaultCaption,
      silosPrices: silosPricesList,
      freight_price: newFreightPrice,
      estimatedDelivery: `${preferences.estimated_delivery_silos} días`,
      extra_product_price: 0,
      extra_product: "",
    };
  };

  return {
    handleSubmit,
    viewPdf,
    budget,
    defaultValues: getSiloDefaultValues(),
    buildDraft,
    onDraftRendered,
  };
};

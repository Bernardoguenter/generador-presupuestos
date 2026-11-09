import { useCallback, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router";
import {
  useCompanyContext,
  usePDFContext,
  usePreferencesContext,
} from "@/common/context";
import {
  CreateBudgetToastError,
  CreateBudgetToastSuccess,
  UpdateBudgetToastError,
  UpdateBudgetToastSuccess,
} from "@/utils/alerts";
import {
  createBudget,
  getBudgetById,
  getBudgetNumber,
  updateBudget,
} from "@/common/lib";
import {
  canShareRemecoPDF,
  companyHasRenders,
  convertPDF,
  getGeneradorURL,
  getStructureRenders,
  prepareRemecoPDF,
  shareRemecoPDF,
  type PreparedRemecoPDF,
  type StructureRenders,
} from "@/helpers";
import { paymentMethods } from "@/helpers";
import {
  getDefaultCaption,
  getStructureDefaultDescription,
  getTotalArs,
} from "@/helpers";
import {
  ConfirmPDFSchema,
  type ConfirmPDFFormData,
} from "@/pages/budgets/schema";
import type { StructureBudget, StructurePDFInfo } from "@/types";

interface UseConfirmStructureSubmitProps {
  getBudget?: (id: string, type: "silo" | "structure") => void;
  handleView?: () => void;
}

export const useConfirmStructureSubmit = ({
  getBudget,
  handleView,
}: UseConfirmStructureSubmitProps) => {
  const { id } = useParams();
  const { pdfInfo, setPdfInfo, setShowPDF, pdfOptions } = usePDFContext();
  const { preferences } = usePreferencesContext();
  const { company } = useCompanyContext();
  const [viewPdf, setViewPdf] = useState<boolean>(false);
  const [budget, setBudget] = useState<StructureBudget | null>(null);
  const navigate = useNavigate();

  const isRemeco = companyHasRenders(company?.company_name);

  // PDF de Remeco armado de antemano (en el celular), para que al tocar
  // "Confirmar Presupuesto" se abra directo el menú de compartir.
  const preparedRef = useRef<{ key: string; pdf: PreparedRemecoPDF } | null>(null);
  const rendersRef = useRef<{ key: string; promise: Promise<StructureRenders> } | null>(null);
  const infoRef = useRef<Promise<{ number: number | null; createdAt?: string }> | null>(null);
  const prepareSeq = useRef(0);

  const remecoOptions = (budgetNumber: number | null) => ({
    dollarQuote: preferences.dollar_quote,
    ivaPercentage: preferences.iva_percentage,
    company,
    roofSlopes: pdfOptions.roofSlopes,
    includeRenders: pdfOptions.includeRenders,
    budgetNumber,
  });

  const buildSubmitData = (formData: ConfirmPDFFormData) => {
    const { dataToSubmit } = pdfInfo as StructurePDFInfo;

    const {
      paymentMethods: _paymentMethods,
      details: _details,
      description: _description,
      estimatedDelivery: _estimatedDelivery,
      total: _total,
      caption: _caption,
      created_by,
      ...restDataToSubmit
    } = dataToSubmit;

    return {
      ...restDataToSubmit,
      paymentMethods: formData.paymentMethods,
      details: formData.details,
      description: formData.description,
      estimatedDelivery: formData.estimatedDelivery,
      total:
        formData.total /
        (1 + dataToSubmit.budget_markup / 100) /
        preferences.dollar_quote,
      caption: formData.caption,
      created_by: typeof created_by === "object" ? created_by.id : created_by,
    };
  };

  /** N° y fecha que va a tener el presupuesto (nuevo o el que se edita). */
  const getBudgetInfo = () => {
    if (!infoRef.current) {
      infoRef.current = (async () => {
        if (id) {
          const { data } = await getBudgetById(id);
          const createdAt = data?.created_at as string | undefined;
          return { number: await getBudgetNumber(company?.id, createdAt), createdAt };
        }
        return { number: await getBudgetNumber(company?.id) };
      })();
    }
    return infoRef.current;
  };

  const preparePdf = useCallback(
    async (values: unknown) => {
      if (!isRemeco || !pdfInfo || !canShareRemecoPDF()) return;
      const parsed = ConfirmPDFSchema.safeParse(values);
      if (!parsed.success) return;
      const seq = ++prepareSeq.current;
      const key = JSON.stringify(parsed.data);
      if (preparedRef.current?.key === key) return;
      try {
        const info = await getBudgetInfo();
        const budget = {
          ...buildSubmitData(parsed.data),
          id: id ?? "",
          created_at: info.createdAt ?? new Date().toISOString(),
        } as StructureBudget;
        let renders: StructureRenders | null = null;
        if (pdfOptions.includeRenders) {
          const rKey = getGeneradorURL(budget, pdfOptions.roofSlopes);
          if (rendersRef.current?.key !== rKey)
            rendersRef.current = {
              key: rKey,
              promise: getStructureRenders(budget, pdfOptions.roofSlopes),
            };
          renders = await rendersRef.current.promise;
        }
        if (seq !== prepareSeq.current) return;
        const pdf = await prepareRemecoPDF(budget, remecoOptions(info.number), renders);
        if (seq !== prepareSeq.current) return;
        preparedRef.current = { key, pdf };
      } catch (error) {
        console.error("No se pudo armar el PDF de antemano", error);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isRemeco, pdfInfo, pdfOptions, preferences, company, id],
  );

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

  const handleDownloadPdf = async (savedBudget: StructureBudget, isNew: boolean) => {
    setViewPdf(true);
    if (isRemeco) {
      // Remeco: presupuesto con un solo precio + hoja de fotos con medidas
      const budgetNumber = await getBudgetNumber(company?.id, savedBudget.created_at);
      const renders =
        pdfOptions.includeRenders &&
        rendersRef.current?.key === getGeneradorURL(savedBudget, pdfOptions.roofSlopes)
          ? await rendersRef.current.promise
          : null;
      const pdf = await prepareRemecoPDF(
        savedBudget,
        remecoOptions(budgetNumber),
        renders,
      );
      await shareRemecoPDF(pdf);
    } else {
      setTimeout(() => convertPDF(savedBudget.customer), 300);
    }

    finishView(isNew);
  };

  const handleSubmit = async (formData: ConfirmPDFFormData) => {
    if (!pdfInfo) return;

    // Si el PDF ya está armado con estos datos, se comparte en el mismo toque
    // (el navegador no deja abrir "Compartir" mucho después del toque).
    const ready =
      isRemeco && preparedRef.current?.key === JSON.stringify(formData)
        ? preparedRef.current.pdf
        : null;
    if (ready) void shareRemecoPDF(ready);

    const budgetSubmitData = buildSubmitData(formData);

    const { data, error } = id
      ? await updateBudget(budgetSubmitData, id)
      : await createBudget(budgetSubmitData);

    if (!error && !id) {
      if (data.id) {
        setBudget(data);
        if (ready) finishView(true);
        else handleDownloadPdf(data, true);
        CreateBudgetToastSuccess();
      }
    } else if (!error && id) {
      setViewPdf(true);
      if (ready) finishView(false);
      else handleDownloadPdf(data, false);
      UpdateBudgetToastSuccess();

      if (getBudget) {
        getBudget(id, "structure");
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

  const getStructureDefaultValues = () => {
    if (!pdfInfo) return null;

    const { dataToSubmit } = pdfInfo as StructurePDFInfo;
    const {
      structure_type,
      length,
      width,
      height,
      enclousure_height,
      total,
      details,
      includes_freight,
      includes_taxes,
    } = dataToSubmit;

    const defaultDescription = getStructureDefaultDescription(
      structure_type,
      width,
      length,
      height,
      enclousure_height,
    );

    const defaultCaption = getDefaultCaption(
      includes_freight,
      includes_taxes,
      preferences.iva_percentage,
      "structure",
    );

    const totalARS = getTotalArs(
      total,
      preferences.dollar_quote,
      dataToSubmit.budget_markup,
    );

    return {
      description: defaultDescription,
      details: details,
      paymentMethods: paymentMethods["Structure"],
      total: totalARS,
      caption: defaultCaption,
      estimatedDelivery: isRemeco
        ? "50 a 60 días"
        : `${preferences.estimated_delivery_structures} días`,
    };
  };

  return {
    handleSubmit,
    viewPdf,
    budget,
    defaultValues: getStructureDefaultValues(),
    preparePdf,
  };
};

import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import {
  CreateBudgetToastError,
  CreateBudgetToastSuccess,
  UpdateBudgetToastError,
  UpdateBudgetToastSuccess,
} from "@/utils/alerts";
import { convertPDF, waitNextFrame, getSiloPDFImages } from "@/helpers";
import { paymentMethods } from "@/helpers";
import { getDefaultCaption, getSilosDescriptions, priceInUSD } from "@/helpers";
import {
  calculateFreightArsPriceWithTaxesAndMarkup,
  getIndividualSiloPrices,
  getSilosPricestArsPriceWithTaxesAndMarkup,
} from "@/helpers";
import type { ConfirmSiloPDFFormData } from "@/pages/budgets/schema";
import type { Silo, SiloBudget, SiloPDFInfo } from "@/types";
import { usePDFContext, usePreferencesContext } from "@/common/context";
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

  const handleDownloadPdf = async (
    customer: string,
    silos: Silo[],
    isNew: boolean,
  ) => {
    setViewPdf(true);
    await waitNextFrame();
    await waitNextFrame();
    const images = await getSiloPDFImages(silos);

    convertPDF(customer, images);

    setTimeout(() => {
      setViewPdf(false);
      setPdfInfo(null);
      setShowPDF(false);
      if (isNew) {
        navigate("/budgets/calculator");
      }
    }, 1000);
  };

  const handleSubmit = async (formData: ConfirmSiloPDFFormData) => {
    if (!pdfInfo) return;
    const { dataToSubmit } = pdfInfo as SiloPDFInfo;
    const {
      includes_taxes,
      paymentMethods,
      description,
      estimatedDelivery,
      freight_price,
      totals,
      total,
      caption,
      created_by,
      ...restDataToSubmit
    } = dataToSubmit;

    if (formData.extra_product !== "" && formData.extra_product) {
      formData.description.push(formData.extra_product);
    }

    const descriptionString = Array.isArray(formData.description)
      ? formData.description.join("; ")
      : formData.description || "";

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

    const { data, error } = id
      ? await updateBudget(budgetSubmitData, id, "silo")
      : await createBudget(budgetSubmitData, "silo");

    if (!error && !id) {
      if (data.id) {
        setBudget(data);
        handleDownloadPdf(data.customer, data.silos, true);
        CreateBudgetToastSuccess();
      }
    } else if (!error && id) {
      setViewPdf(true);

      handleDownloadPdf(data.customer, data.silos, false);
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
  };
};

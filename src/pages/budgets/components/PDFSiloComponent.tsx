import { paymentMethods } from "../../../helpers/staticData";
import { Form } from "../../../components";
import { ConfirmSiloPDFSchema, type ConfirmSiloPDFFormData } from "../schema";
import { usePDFContext, usePreferencesContext } from "../../../common/context";
import {
  CreateBudgetToastError,
  CreateBudgetToastSuccess,
  UpdateBudgetToastError,
  UpdateBudgetToastSuccess,
} from "../../../utils/alerts";
import { createBudget, updateBudget } from "../../../common/lib";
import { useNavigate, useParams } from "react-router";
import { convertPDF } from "../../../helpers/generatePDF";
import { useState } from "react";
import { PDFViewComponent } from "../budgetDetail/PDFViewComponent";
import type { SiloBudget, SiloPDFInfo } from "../../../helpers/types";
import {
  getDefaultCaption,
  getSilosDescriptions,
} from "../../../helpers/formatData";
import { PDFSiloFormContent } from "./PDFSiloFormContent";
import {
  calculateFreightArsPriceWithTaxesAndMarkup,
  getIndividualSiloPrices,
  getSilosPricestArsPriceWithTaxesAndMarkup,
} from "../../../helpers/formulas";

interface Props {
  getBudget?: (id: string, type: "silo" | "structure") => void;
  handleView?: () => void;
}

export const PDFSiloComponent = ({ getBudget, handleView }: Props) => {
  const { id } = useParams();
  const { pdfInfo, setPdfInfo, setShowPDF } = usePDFContext();
  const { preferences } = usePreferencesContext();
  const [viewPdf, setViewPdf] = useState<boolean>(false);
  const [budget, setBudget] = useState<SiloBudget | null>(null);
  const navigate = useNavigate();

  if (!pdfInfo) {
    return;
  }

  const { dataToSubmit, includes_freight, freight_price, includes_taxes } =
    pdfInfo as SiloPDFInfo;

  const defaultDescription = getSilosDescriptions(dataToSubmit.silos);

  const defaultCaption = getDefaultCaption(
    includes_freight,
    pdfInfo.includes_taxes,
    preferences.iva_percentage
  );

  const silosPricesFromPreferences = getIndividualSiloPrices(
    dataToSubmit.silos,
    preferences
  );

  const silosPricesList = getSilosPricestArsPriceWithTaxesAndMarkup(
    silosPricesFromPreferences,
    preferences.dollar_quote,
    preferences.default_markup,
    dataToSubmit.budget_markup,
    includes_taxes,
    preferences.iva_percentage
  );

  const newFreightPrice = calculateFreightArsPriceWithTaxesAndMarkup(
    freight_price,
    preferences.dollar_quote,
    preferences.default_markup,
    dataToSubmit.budget_markup,
    includes_taxes,
    preferences.iva_percentage
  );

  const totalARS = silosPricesList.reduce(
    (sum, acc) => sum + acc,
    newFreightPrice
  );

  const defaultValues = {
    description: defaultDescription,
    paymentMethods: paymentMethods,
    total: totalARS,
    caption: defaultCaption,
    silosPrices: silosPricesList,
    freight_price: newFreightPrice,
  };

  const handleDownloadPdf = (customer: string, isNew: boolean) => {
    setViewPdf(true);
    setTimeout(() => {
      convertPDF(customer);
    }, 300);

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
    const descriptionString = Array.isArray(formData.description)
      ? formData.description.join("; ")
      : formData.description || "";

    const budgetSubmitData = {
      ...dataToSubmit,
      paymentMethods: formData.paymentMethods,
      description: descriptionString,
      freight_price:
        newFreightPrice /
        (1 + dataToSubmit.budget_markup / 100) /
        preferences.dollar_quote,
      totals: {
        silos: (formData?.silosPrices ?? []).map((silo) => {
          const totalPrice =
            silo /
            preferences.dollar_quote /
            (1 + preferences.default_markup / 100) /
            (1 + dataToSubmit.budget_markup / 100);
          return includes_taxes
            ? totalPrice
            : (totalPrice * (100 - preferences.iva_percentage)) / 100;
        }),
        freight_price: freight_price,
        total:
          formData.total /
          (1 + dataToSubmit.budget_markup / 100) /
          preferences.dollar_quote,
      },
      caption: formData.caption,
      created_by:
        typeof dataToSubmit.created_by === "object"
          ? dataToSubmit.created_by.id
          : dataToSubmit.created_by,
    };

    const { data, error } = id
      ? await updateBudget(budgetSubmitData, id, "silo")
      : await createBudget(budgetSubmitData, "silo");

    if (!error && !id) {
      if (data.id) {
        setBudget(data);
        handleDownloadPdf(data.customer, true);
        CreateBudgetToastSuccess();
      }
    } else if (!error && id) {
      setViewPdf(true);
      handleDownloadPdf(data.customer, false);
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

  return (
    <Form
      onSubmit={handleSubmit}
      defaultValues={defaultValues}
      schema={ConfirmSiloPDFSchema}
      className="w-full lg:w-1/2">
      {viewPdf && budget ? (
        <PDFViewComponent
          budget={budget}
          type="silo"
        />
      ) : (
        <PDFSiloFormContent />
      )}
    </Form>
  );
};

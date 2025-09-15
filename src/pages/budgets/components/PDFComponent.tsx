import { paymentMethods } from "../../../helpers/staticData";
import { Form } from "../../../components";
import { ConfirmPDFhema, type ConfirmPDFFormData } from "../schema";
import { PDFFormContent } from "./PDFFormContent";
import { usePDFContext, usePreferencesContext } from "../../../common/context";
import {
  CreateBudgetToastError,
  CreateBudgetToastSuccess,
  UpdateBudgetToastError,
  UpdateBudgetToastSuccess,
} from "../../../utils/alerts";
import { createBudget, updateBudget } from "../../../common/lib";
import { useParams } from "react-router";
import { convertPDF } from "../../../helpers/generatePDF";
import { useState } from "react";
import { PDFViewComponent } from "../budgetDetail/PDFViewComponent";
import type { StructureBudget } from "../../../helpers/types";
import {
  getDefaultCaption,
  getDefaultDescription,
  getTotalArs,
} from "../../../helpers/formatData";

interface Props {
  getBudget?: (id: string) => void;
  handleView?: () => void;
}

export const PDFComponent = ({ getBudget, handleView }: Props) => {
  const { id } = useParams();
  const { pdfInfo, setPdfInfo, setShowPDF } = usePDFContext();
  const { preferences } = usePreferencesContext();
  const [viewPdf, setViewPdf] = useState<boolean>(false);
  const [budget, setBudget] = useState<StructureBudget | null>(null);

  if (!pdfInfo) {
    return;
  }

  const {
    structure_type,
    length,
    width,
    height,
    enclousure_height,
    total,
    details,
    dataToSubmit,
    includes_freight,
  } = pdfInfo;

  const defaultDescription = getDefaultDescription(
    structure_type,
    width,
    length,
    height,
    enclousure_height
  );

  const defaultCaption = getDefaultCaption(
    includes_freight,
    pdfInfo.includes_taxes,
    preferences.iva_percentage
  );

  const totalARS = getTotalArs(
    total,
    preferences.dollar_quote,
    dataToSubmit.budget_markup
  );

  const defaultValues = {
    description: defaultDescription,
    details: details,
    paymentMethods: paymentMethods,
    total: totalARS,
    caption: defaultCaption,
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
        window.location.replace("/budgets/calculator");
      }
    }, 1000);
  };

  const handleSubmit = async (formData: ConfirmPDFFormData) => {
    const createBudgetSubmitData = {
      ...dataToSubmit,
      paymentMethods: formData.paymentMethods,
      details: formData.details,
      description: formData.description,
      total:
        formData.total /
        (1 + dataToSubmit.budget_markup / 100) /
        preferences.dollar_quote,
      caption: formData.caption,
      created_by:
        typeof dataToSubmit.created_by === "object"
          ? dataToSubmit.created_by.id
          : dataToSubmit.created_by,
    };

    const { data, error } = id
      ? await updateBudget(createBudgetSubmitData, id)
      : await createBudget(createBudgetSubmitData);

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
        getBudget(id);
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
      schema={ConfirmPDFhema}
      className="w-full lg:w-1/2">
      {viewPdf && budget ? (
        <PDFViewComponent budget={budget} />
      ) : (
        <PDFFormContent />
      )}
    </Form>
  );
};

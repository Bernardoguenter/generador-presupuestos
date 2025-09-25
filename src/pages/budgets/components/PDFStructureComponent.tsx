import { paymentMethods } from "../../../helpers/staticData";
import { Form } from "../../../components";
import { ConfirmPDFSchema, type ConfirmPDFFormData } from "../schema";
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
import type { StructureBudget, StructurePDFInfo } from "../../../helpers/types";
import {
  getDefaultCaption,
  getStructureDefaultDescription,
  getTotalArs,
} from "../../../helpers/formatData";
import { PDFStructureFormContent } from "./PDFStructureFormContent";

interface Props {
  getBudget?: (id: string, type: "silo" | "structure") => void;
  handleView?: () => void;
}

export const PDFStructureComponent = ({ getBudget, handleView }: Props) => {
  const { id } = useParams();
  const { pdfInfo, setPdfInfo, setShowPDF } = usePDFContext();
  const { preferences } = usePreferencesContext();
  const [viewPdf, setViewPdf] = useState<boolean>(false);
  const [budget, setBudget] = useState<StructureBudget | null>(null);
  const navigate = useNavigate();

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
  } = pdfInfo as StructurePDFInfo;

  const defaultDescription = getStructureDefaultDescription(
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
        navigate("/budgets/calculator");
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

  return (
    <Form
      onSubmit={handleSubmit}
      defaultValues={defaultValues}
      schema={ConfirmPDFSchema}
      className="w-full lg:w-1/2">
      {viewPdf && budget ? (
        <PDFViewComponent
          budget={budget}
          type={"structure"}
        />
      ) : (
        <PDFStructureFormContent />
      )}
    </Form>
  );
};

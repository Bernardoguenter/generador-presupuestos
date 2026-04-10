import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { usePDFContext, usePreferencesContext } from "@/common/context";
import {
  CreateBudgetToastError,
  CreateBudgetToastSuccess,
  UpdateBudgetToastError,
  UpdateBudgetToastSuccess,
} from "@/utils/alerts";
import { createBudget, updateBudget } from "@/common/lib";
import { convertPDF } from "@/helpers";
import { paymentMethods } from "@/helpers";
import {
  getDefaultCaption,
  getStructureDefaultDescription,
  getTotalArs,
} from "@/helpers";
import type { ConfirmPDFFormData } from "@/pages/budgets/schema";
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
  const { pdfInfo, setPdfInfo, setShowPDF } = usePDFContext();
  const { preferences } = usePreferencesContext();
  const [viewPdf, setViewPdf] = useState<boolean>(false);
  const [budget, setBudget] = useState<StructureBudget | null>(null);
  const navigate = useNavigate();

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
    if (!pdfInfo) return;

    const { dataToSubmit } = pdfInfo as StructurePDFInfo;

    const {
      paymentMethods,
      details,
      description,
      estimatedDelivery,
      total,
      caption,
      created_by,
      ...restDataToSubmit
    } = dataToSubmit;

    const budgetSubmitData = {
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

    const { data, error } = id
      ? await updateBudget(budgetSubmitData, id)
      : await createBudget(budgetSubmitData);

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
      estimatedDelivery: `${preferences.estimated_delivery_structures} días`,
    };
  };

  return {
    handleSubmit,
    viewPdf,
    budget,
    defaultValues: getStructureDefaultValues(),
  };
};

import { paymentMethods } from "../../../../helpers/staticData";
import { Form } from "../../../../components";
import { ConfirmPDFhema, type ConfirmPDFFormData } from "../../schema";
import { PDFFormContent } from "./PDFFormContent";
import {
  usePDFContext,
  usePreferencesContext,
} from "../../../../common/context";
import {
  CreateBudgetToastError,
  CreateBudgetToastSuccess,
} from "../../../../utils/alerts";
import { createBudget } from "../../../../common/lib";
import { useNavigate } from "react-router";

export const PDFComponent = () => {
  const { pdfInfo, setPdfInfo, setShowPDF } = usePDFContext();
  const { preferences } = usePreferencesContext();
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
    totals,
    details,
    dataToSubmit,
  } = pdfInfo;

  const defaultDescription =
    structure_type === "Galpón"
      ? `${structure_type} de ${width}mts x ${length}mts x ${height}mts de altura libre con ${enclousure_height}mts cerramiento de chapa en los laterales.`
      : `${structure_type} de ${width}mts x ${length}mts x ${height}mts de altura libre`;

  const totalARS = totals.finalPriceInDollars * preferences.dollar_quote;

  const defaultValues = {
    description: defaultDescription,
    details: details,
    paymentMethods: paymentMethods,
    total: totalARS,
  };

  const handleSubmit = async (formData: ConfirmPDFFormData) => {
    const createBudgetSubmitData = {
      ...dataToSubmit,
      paymentMethods: formData.paymentMethods,
      details: formData.details,
      description: formData.description,
      total: formData.total / preferences.dollar_quote,
    };

    const { data, error } = await createBudget(createBudgetSubmitData);

    if (!error) {
      CreateBudgetToastSuccess();
      setPdfInfo(null);
      setShowPDF(false);
      if (data.id) {
        navigate(`/budgets/${data.id}`);
      }
    } else {
      CreateBudgetToastError();
    }
  };

  return (
    <Form
      onSubmit={handleSubmit}
      defaultValues={defaultValues}
      schema={ConfirmPDFhema}
      className="w-full lg:w-3/5">
      <PDFFormContent />
    </Form>
  );
};

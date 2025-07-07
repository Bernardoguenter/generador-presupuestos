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
  UpdateBudgetToastError,
} from "../../../../utils/alerts";
import { createBudget, updateBudget } from "../../../../common/lib";
import { useNavigate, useParams } from "react-router";

interface Props {
  getBudget?: (id: string) => void;
  handleView?: () => void;
}

export const PDFComponent = ({ getBudget, handleView }: Props) => {
  const { id } = useParams();
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
    total,
    details,
    dataToSubmit,
    includes_freight,
  } = pdfInfo;

  const defaultDescription =
    structure_type === "Galpón"
      ? `${structure_type} de ${width}mts x ${length}mts x ${height}mts de altura libre con ${enclousure_height}mts cerramiento de chapa en los laterales.`
      : `${structure_type} de ${width}mts x ${length}mts x ${height}mts de altura libre`;

  const defaultCaption = `${
    includes_freight
      ? "* El precio inlcuye el flete"
      : "* El precio no inlcuye el flete"
  }; * Montaje incluído; ${
    pdfInfo?.includes_taxes
      ? `* Incluye IVA ${preferences.iva_percentage}%`
      : `* No Incluye IVA ${preferences.iva_percentage}%`
  };
    `;

  const totalARS =
    total * preferences.dollar_quote * (1 + dataToSubmit.budget_markup / 100);

  const defaultValues = {
    description: defaultDescription,
    details: details,
    paymentMethods: paymentMethods,
    total: totalARS,
    caption: defaultCaption,
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
    };

    const { data, error } = id
      ? await updateBudget(createBudgetSubmitData, id)
      : await createBudget(createBudgetSubmitData);

    if (!error && !id) {
      setPdfInfo(null);
      setShowPDF(false);
      if (data.id) {
        navigate(`/budgets/${data.id}`);
      }
    } else if (!error && id) {
      setPdfInfo(null);
      setShowPDF(false);
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
      className="w-full lg:w-3/5">
      <PDFFormContent />
    </Form>
  );
};

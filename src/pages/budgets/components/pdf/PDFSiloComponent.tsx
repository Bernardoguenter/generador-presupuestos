import { Form } from "@/components";
import { ConfirmSiloPDFSchema } from "@/pages/budgets/schema";
import { useConfirmSiloSubmit } from "../../hooks";
import { PDFViewComponent } from "../../budgetDetail/pdf/PDFViewComponent";
import { PDFSiloFormContent } from "./PDFSiloFormContent";

interface Props {
  getBudget?: (id: string, type: "silo" | "structure") => void;
  handleView?: () => void;
}

export const PDFSiloComponent = ({ getBudget, handleView }: Props) => {
  const { defaultValues, handleSubmit, viewPdf, budget } =
    useConfirmSiloSubmit({ getBudget, handleView });

  if (!defaultValues) {
    return null;
  }

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

import { Form } from "@/components";
import { ConfirmPDFSchema } from "../../schema";
import { useConfirmStructureSubmit } from "../../hooks";
import { PDFViewComponent } from "../../budgetDetail/pdf/PDFViewComponent";
import { PDFStructureFormContent } from "./PDFStructureFormContent";

interface Props {
  getBudget?: (id: string, type: "silo" | "structure") => void;
  handleView?: () => void;
}

export const PDFStructureComponent = ({ getBudget, handleView }: Props) => {
  const { defaultValues, handleSubmit, viewPdf, budget } =
    useConfirmStructureSubmit({ getBudget, handleView });

  if (!defaultValues) {
    return null;
  }

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

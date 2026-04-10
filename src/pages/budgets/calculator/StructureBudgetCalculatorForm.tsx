import { usePDFContext } from "@/common/context";
import { Button, Form } from "@/components";
import { ResetFormButton } from "../components/ResetFormButton";
import {
  calculateStructureBudgetSchema,
  type StructureBudgetFormData,
} from "../schema";
import { useStructureBudgetSubmit } from "../hooks";
import { StructureBudgetFormContent } from "../components/structures/StructureBudgetFormContent";
import { PDFStructureComponent } from "../components/pdf/PDFStructureComponent";

export const StructureBudgetCalculatorForm = () => {
  const { setShowPDF, showPDF, pdfInfo } = usePDFContext();
  const { handleStructureBudgetSubmit, defaultValues } =
    useStructureBudgetSubmit();



  return (
    <div className="flex lg:flex-row flex-col w-full gap-8 ">
      <Form
        onSubmit={handleStructureBudgetSubmit}
        schema={calculateStructureBudgetSchema}
        defaultValues={defaultValues}
        className="mt-4 w-full lg:w-1/2">
        <StructureBudgetFormContent />
        <Button
          type="submit"
          color="info"
          styles="mt-4">
          Crear Vista Previa
        </Button>
        <ResetFormButton<StructureBudgetFormData>
          setShowPDF={setShowPDF}
          defaultValues={defaultValues}
        />
      </Form>
      {showPDF && pdfInfo && <PDFStructureComponent />}
    </div>
  );
};

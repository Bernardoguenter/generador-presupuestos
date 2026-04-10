import { Button, Form } from "@/components";
import { ResetFormButton } from "../components/ResetFormButton";
import { SiloBudgetFormContent } from "../components/silos/SiloBudgetFormContent";
import { calculateSiloBudgetSchema, type SiloBudgetFormData } from "../schema";
import { useSiloBudgetSubmit } from "../hooks";
import { usePDFContext } from "@/common/context";
import { PDFSiloComponent } from "../components";

export const SiloBudgetCalculatorForm = () => {
  const { setShowPDF, showPDF, pdfInfo } = usePDFContext();
  const { handleSiloBudgetSubmit, defaultValues } = useSiloBudgetSubmit();

  return (
    <div className="flex lg:flex-row flex-col w-full gap-8 ">
      <Form
        onSubmit={handleSiloBudgetSubmit}
        schema={calculateSiloBudgetSchema}
        defaultValues={defaultValues}
        className="mt-4 w-full lg:w-1/2">
        <SiloBudgetFormContent />
        <Button
          type="submit"
          color="info"
          styles="mt-4">
          Crear Vista Previa
        </Button>
        <ResetFormButton<SiloBudgetFormData>
          setShowPDF={setShowPDF}
          defaultValues={defaultValues}
        />
      </Form>
      {showPDF && pdfInfo && <PDFSiloComponent />}
    </div>
  );
};

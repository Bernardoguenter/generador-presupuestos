import { useMemo } from "react";
import { Button, Form } from "../../../components";
import { ResetFormButton } from "../components/ResetFormButton";
import { SiloBudgetFormContent } from "../components/SiloBudgetFormContent";
import { calculateSiloBudgetSchema, type SiloBudgetFormData } from "../schema";
import { useSiloBudgetSubmit } from "../../../common/hooks";
import { usePDFContext } from "../../../common/context";
import { PDFSiloComponent } from "../components/PDFSiloComponent";

export const SiloBudgetCalculatorForm = () => {
  const { setShowPDF, showPDF, pdfInfo } = usePDFContext();
  const { handleSiloBudgetSubmit } = useSiloBudgetSubmit();

  const defaultValues = useMemo(
    () => ({
      includes_freight: false,
      distanceCalculation: "distance",
      distanceInKms: 0,
      includes_taxes: true,
      customer: "",
      address: "",
      lng: 0,
      lat: 0,
      budget_markup: 0,
      silos: [
        { type: "airbase_silos", capacity: "6tn", cone_base: "estandar" },
      ],
    }),
    []
  );

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

import { useMemo } from "react";
import { usePDFContext } from "../../../common/context";
import { Button, Form } from "../../../components";
import { ResetFormButton } from "../components/ResetFormButton";
import {
  calculateStructureBudgetSchema,
  type StructureBudgetFormData,
} from "../schema";
import { useStructureBudgetSubmit } from "../../../common/hooks";
import { StructureBudgetFormContent } from "../components/StructureBudgetFormContent";
import { PDFStructureComponent } from "../components/PDFStructureComponent";

export const StructureBudgetCalculatorForm = () => {
  const { setShowPDF, showPDF, pdfInfo } = usePDFContext();
  const { handleStructureBudgetSubmit } = useStructureBudgetSubmit();

  const defaultValues: StructureBudgetFormData = useMemo(
    () => ({
      material: "Hierro torsionado",
      structure_type: "Galpón",
      width: 15,
      length: 25,
      height: 5,
      enclousure_height: 4.5,
      includes_freight: false,
      distanceCalculation: "distance",
      distanceInKms: 0,
      color_roof_sheet: false,
      color_side_sheet: false,
      includes_taxes: true,
      customer: "",
      has_gutter: false,
      gutter_metters: 0,
      gates_measurements: [{ width: 5, height: 4.5 }],
      includes_gate: true,
      number_of_gates: 1,
      address: "",
      lng: 0,
      lat: 0,
      budget_markup: 0,
    }),
    []
  );

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

import { useMemo } from "react";
import { usePDFContext } from "../../../common/context";
import {
  NumberInput,
  TextInput,
  CheckboxInput,
  Button,
  Form,
} from "../../../components";
import { FreightInput } from "../../../components/FreightInput";
import { ColorSideSheetInput } from "../components/ColorSideSheetInput";
import { EnclousureHeightInput } from "../components/EnclousureHeightInput";
import { GutterInput } from "../components/GutterInput";
import { IncludesGatesInput } from "../components/IncludesGatesInput";
import { MaterialsSelect } from "../components/MaterialsSelect";
import { PDFComponent } from "../components/PDFComponent";
import { ResetFormButton } from "../components/ResetFormButton";
import { StructureSelect } from "../components/StructureSelect";
import { calculateBudgetSchema } from "../schema";
import { useBudgetSubmit } from "../../../common/hooks";

export const BudgetCalculatorForm = () => {
  const { setShowPDF, showPDF, pdfInfo } = usePDFContext();
  const { handleBudgetSubmit } = useBudgetSubmit();

  const defaultValues = useMemo(
    () => ({
      material: "Hierro torsionado",
      structure_type: "Galpón",
      width: 15,
      length: 25,
      height: 5,
      enclousure_height: 4.5,
      includes_freight: false,
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
        onSubmit={handleBudgetSubmit}
        schema={calculateBudgetSchema}
        defaultValues={defaultValues}
        className="mt-4 w-full lg:w-1/2">
        <MaterialsSelect />
        <StructureSelect />
        <NumberInput
          label="Ancho"
          name="width"
        />
        <NumberInput
          label="Largo"
          name="length"
        />
        <NumberInput
          label="Alto"
          name="height"
        />
        <EnclousureHeightInput />
        <FreightInput />
        <TextInput
          name="customer"
          label="Cliente"
        />
        <div className="flex justify-between items-start">
          <GutterInput />
        </div>
        <IncludesGatesInput />
        <CheckboxInput
          name="color_roof_sheet"
          label="Techo a color?"
        />
        <ColorSideSheetInput />
        <NumberInput
          label="Margen extra de presupuesto"
          name="budget_markup"
        />
        <CheckboxInput
          name="includes_taxes"
          label="Incluye IVA?"
        />
        <Button
          type="submit"
          color="info"
          styles="mt-4">
          Crear Vista Previa
        </Button>
        <ResetFormButton
          setShowPDF={setShowPDF}
          defaultValues={defaultValues}
        />
      </Form>
      {showPDF && pdfInfo && <PDFComponent />}
    </div>
  );
};

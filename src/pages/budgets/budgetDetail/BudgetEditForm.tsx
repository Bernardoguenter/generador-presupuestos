import { useEffect, useMemo } from "react";
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
import type { StructureBudget } from "../../../helpers/types";
import { usePDFContext } from "../../../common/context";
import { useBudgetSubmit } from "../../../common/hooks";

interface Props {
  budget: StructureBudget;
  getBudget: (id: string) => void;
  handleView: () => void;
  viewDetail: boolean;
}

export const BudgetEditForm = ({
  budget,
  getBudget,
  handleView,
  viewDetail,
}: Props) => {
  const { setPdfInfo, setShowPDF } = usePDFContext();
  const { handleBudgetSubmit } = useBudgetSubmit();

  useEffect(() => {
    setPdfInfo({
      customer: budget.customer,
      details: budget.details,
      structure_type: budget.structure_type,
      width: budget.width,
      length: budget.length,
      height: budget.height,
      enclousure_height: budget.enclousure_height,
      includes_gate: budget.includes_gate,
      includes_taxes: budget.includes_taxes,
      freight_price: budget.freight_price,
      includes_freight: budget.includes_freight,
      total: budget.total * (1 + budget.budget_markup / 100),
      dataToSubmit: budget,
    });
  }, [budget, setPdfInfo]);

  const defaultValues = useMemo(
    () => ({
      material: budget.material,
      structure_type: budget.structure_type,
      width: budget.width,
      length: budget.length,
      height: budget.height,
      enclousure_height: budget.enclousure_height,
      includes_freight: budget.includes_freight,
      color_roof_sheet: budget.color_roof_sheet,
      color_side_sheet: budget.color_side_sheet,
      includes_taxes: budget.includes_taxes,
      customer: budget.customer,
      has_gutter: budget.has_gutter,
      gutter_metters: budget.gutter_metters,
      gates_measurements: budget.gates_measurements ?? [],
      includes_gate: budget.includes_gate,
      number_of_gates: budget.number_of_gates,
      address: budget.address?.address,
      lng: budget.address?.lng,
      lat: budget.address?.lat,
      budget_markup: budget.budget_markup,
    }),
    [budget]
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
      {viewDetail && (
        <PDFComponent
          getBudget={getBudget}
          handleView={handleView}
        />
      )}
    </div>
  );
};

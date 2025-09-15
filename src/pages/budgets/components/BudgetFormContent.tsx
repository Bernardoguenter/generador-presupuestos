import {
  Fieldset,
  TextInput,
  NumberInput,
  CheckboxInput,
} from "../../../components";
import { FreightInput } from "../../../components/FreightInput";
import { ColorSideSheetInput } from "./ColorSideSheetInput";
import { EnclousureHeightInput } from "./EnclousureHeightInput";
import { GutterInput } from "./GutterInput";
import { IncludesGatesInput } from "./IncludesGatesInput";
import { MaterialsSelect } from "./MaterialsSelect";
import { StructureSelect } from "./StructureSelect";

export const BudgetFormContent = () => {
  return (
    <>
      <Fieldset title="Cliente">
        <TextInput
          name="customer"
          label="Nombre de cliente"
        />
      </Fieldset>

      <Fieldset title="Material y Estructura">
        <MaterialsSelect />
        <StructureSelect />
      </Fieldset>
      <Fieldset title="Medidas">
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
      </Fieldset>
      <FreightInput />
      <GutterInput />
      <Fieldset title="Chapa Color">
        <CheckboxInput
          name="color_roof_sheet"
          label="Techo a color?"
        />
        <ColorSideSheetInput />
      </Fieldset>
      <IncludesGatesInput />

      <Fieldset title="Margen e Impuestos">
        <NumberInput
          label="Margen extra de presupuesto"
          name="budget_markup"
        />
        <CheckboxInput
          name="includes_taxes"
          label="Incluye IVA?"
        />
      </Fieldset>
    </>
  );
};

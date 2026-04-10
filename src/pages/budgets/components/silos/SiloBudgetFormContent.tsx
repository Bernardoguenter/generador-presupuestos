import { CheckboxInput, Fieldset, NumberInput, TextInput } from "@/components";
import { FieldsetRow } from "@/components";
import { FreightInput } from "../FreightInput";
import { SilosSelectGroup } from "./SilosSelectGroup";

export const SiloBudgetFormContent = () => {
  return (
    <>
      <Fieldset title="Cliente">
        <TextInput
          name="customer"
          label="Nombre de cliente"
        />
      </Fieldset>
      <FieldsetRow title="Agregar Silo">
        <SilosSelectGroup />
      </FieldsetRow>
      <FreightInput />
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

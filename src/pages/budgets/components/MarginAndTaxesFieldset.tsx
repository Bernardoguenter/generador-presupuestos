import { Fieldset, NumberInput, CheckboxInput } from "@/components";

export const MarginAndTaxesFieldset = () => {
  return (
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
  );
};

import { Fieldset, NumberInput } from "../../../../components";

export const PreferencesGenerales = () => {
  return (
    <Fieldset
      title="Generales"
      id="generales">
      <NumberInput
        label="Cotización dólar"
        name="dollar_quote"
      />
      <NumberInput
        label="Porcentaje adicional"
        name="default_markup"
      />
      <NumberInput
        label="Porcentaje de IVA"
        name="iva_percentage"
      />
      <NumberInput
        label="Precio por Km de flete"
        name="km_price"
      />
    </Fieldset>
  );
};

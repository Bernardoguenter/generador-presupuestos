import { Fieldset, NumberInput } from "@/components";

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
      <NumberInput
        label="Tiempo de entrega estimado Silos (en días)"
        name="estimated_delivery_silos"
      />
      <NumberInput
        label="Tiempo de entrega estimado Estructuras (en días)"
        name="estimated_delivery_structures"
      />
    </Fieldset>
  );
};

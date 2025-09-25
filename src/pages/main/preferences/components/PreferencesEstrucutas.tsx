import { Fieldset, NumberInput } from "../../../../components";
import { SolidWebPrices } from "./SolidWebPrices";

export const PreferencesEstrucutas = () => {
  return (
    <>
      <Fieldset
        title="Estructuras"
        id="estructuras">
        <NumberInput
          label="Precio Portón por m2"
          name="gate_price"
        />
        <NumberInput
          label="Costo Cerramiento m2"
          name="enclousure_cost"
        />
        <NumberInput
          label="Precio por metro de canaleta"
          name="gutter_price"
        />

        <NumberInput
          label="Diferencia Chapa Color"
          name="colored_sheet_difference"
        />
      </Fieldset>
      <Fieldset title="Hierro Torsionado">
        <NumberInput
          label="Costo Hierro torsionado m2"
          name="twisted_iron_cost"
        />
        <NumberInput
          label="Costo columna Hierro torsionado"
          name="twisted_iron_column_cost"
        />
      </Fieldset>
      <Fieldset title="Perfil U">
        <NumberInput
          label="Costo Perfil U m2"
          name="u_profile_cost"
        />
        <NumberInput
          label="Costo columnas Perfil U"
          name="u_profile_column_cost"
        />
      </Fieldset>
      <SolidWebPrices />
    </>
  );
};

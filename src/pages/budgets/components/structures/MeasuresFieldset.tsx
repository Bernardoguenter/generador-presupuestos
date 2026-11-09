import { Fieldset, NumberInput } from "@/components";
import { WidthDefaults } from "./WidthDefaults";

export const MeasuresFieldset = () => {
  return (
    <>
      <WidthDefaults />
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
      </Fieldset>
    </>
  );
};

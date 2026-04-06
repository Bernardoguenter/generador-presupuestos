import { Fieldset, NumberInput } from "@/components";

export const MeasuresFieldset = () => {
  return (
    <>
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

import { CheckboxInput, Fieldset, NumberInput } from "@/components";
import { EnclousureHeightInput } from "./EnclousureHeightInput";
import { useFormContext, useWatch } from "react-hook-form";

export const EnclousureInputs = () => {
  const { control } = useFormContext();
  const uniform_enclousure = useWatch({ control, name: "uniform_enclousure" });
  const structure_type = useWatch({ control, name: "structure_type" });

  return (
    <>
      {structure_type === "Galpón" && (
        <>
          <Fieldset title="Cerramientos">
            <CheckboxInput
              label="Cerramiento uniforme"
              name="uniform_enclousure"></CheckboxInput>
            <div></div>
            {uniform_enclousure ? (
              <EnclousureHeightInput />
            ) : (
              <MultipleEnclousureHeightInput />
            )}
          </Fieldset>
        </>
      )}
    </>
  );
};

const MultipleEnclousureHeightInput = () => {
  return (
    <>
      <NumberInput
        label="Cerramiento lateral izquierdo"
        name="enclousure_height[0]"
      />
      <NumberInput
        label="Cerramiento lateral derecho"
        name="enclousure_height[1]"
      />
      <NumberInput
        label="Cerramiento lateral frontal"
        name="enclousure_height[2]"
      />
      <NumberInput
        label="Cerramiento lateral back"
        name="enclousure_height[3]"
      />
    </>
  );
};

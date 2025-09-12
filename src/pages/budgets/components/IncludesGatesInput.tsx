import { useFormContext, useWatch } from "react-hook-form";
import { GatesInput } from "./GatesInput";
import { CheckboxInput, Fieldset } from "../../../components";

export const IncludesGatesInput = () => {
  const { control } = useFormContext();
  const structureType = useWatch({ control, name: "structure_type" });

  return (
    <>
      {structureType === "Galpón" && (
        <Fieldset title="Portones">
          <CheckboxInput
            name="includes_gate"
            label="¿Incluye portón?"
          />
          <GatesInput />
        </Fieldset>
      )}
    </>
  );
};

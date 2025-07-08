import { useFormContext, useWatch } from "react-hook-form";
import { GatesInput } from "./GatesInput";
import { CheckboxInput } from "../../../components";

export const IncludesGatesInput = () => {
  const { control } = useFormContext();
  const structureType = useWatch({ control, name: "structure_type" });

  return (
    <>
      {structureType === "Galpón" && (
        <div className="flex-justify-between ite">
          <CheckboxInput
            name="includes_gate"
            label="¿Incluye portón?"
          />
          <GatesInput />
        </div>
      )}
    </>
  );
};

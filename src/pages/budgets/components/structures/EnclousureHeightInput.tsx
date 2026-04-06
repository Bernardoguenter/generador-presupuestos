import { useFormContext, useWatch } from "react-hook-form";
import { NumberInput } from "@/components";
import { useEffect } from "react";

export const EnclousureHeightInput = () => {
  const { control, setValue } = useFormContext();
  const structureType = useWatch({ control, name: "structure_type" });
  const uniform_enclousure = useWatch({ control, name: "uniform_enclousure" });
  const enclousure_height = useWatch({
    control,
    name: "enclousure_height",
  });

  useEffect(() => {
    if (uniform_enclousure) {
      setValue("enclousure_height[0]", enclousure_height[0]);
      setValue("enclousure_height[1]", enclousure_height[0]);
      setValue("enclousure_height[2]", enclousure_height[0]);
      setValue("enclousure_height[3]", enclousure_height[0]);
    } else {
      setValue("enclousure_height[0]", enclousure_height[0]);
      setValue("enclousure_height[1]", enclousure_height[1]);
      setValue("enclousure_height[2]", enclousure_height[2]);
      setValue("enclousure_height[3]", enclousure_height[3]);
    }
  }, [uniform_enclousure, setValue]);

  return (
    <>
      {structureType === "Galpón" && (
        <NumberInput
          label="Cerramiento"
          name="enclousure_height[0]"
        />
      )}
    </>
  );
};

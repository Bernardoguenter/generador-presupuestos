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
      const h0 = enclousure_height?.[0];
      if (h0 === undefined) return;

      if (enclousure_height[1] !== h0) setValue("enclousure_height[1]", h0);
      if (enclousure_height[2] !== h0) setValue("enclousure_height[2]", h0);
      if (enclousure_height[3] !== h0) setValue("enclousure_height[3]", h0);
    }
  }, [uniform_enclousure, enclousure_height?.[0], setValue]);

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

import { useFormContext, useWatch } from "react-hook-form";

import { NumberInput } from "../../../components";

export const EnclousureHeightInput = () => {
  const { control } = useFormContext();
  const structureType = useWatch({ control, name: "structure_type" });

  return (
    <>
      {structureType === "Galpón" && (
        <NumberInput
          label="Cerramiento"
          name="enclousure_height"
        />
      )}
    </>
  );
};

import { useFormContext, useWatch } from "react-hook-form";
import { CheckboxInput } from "@/components";
import { useEffect } from "react";

export const MembraneCheckbox = () => {
  const { control, setValue } = useFormContext();

  const structureType = useWatch({ control, name: "structure_type" });

  const sides_sheets_option = useWatch({
    control,
    name: "sides_sheets_option",
  });

  const hasPanel =
    typeof sides_sheets_option === "string" &&
    sides_sheets_option.toLowerCase().includes("panel");

  useEffect(() => {
    if (structureType !== "Galpón" || hasPanel) {
      setValue("has_sides_membrane", false);
    }
  }, [structureType, hasPanel, setValue]);

  return (
    <>
      <CheckboxInput
        label="Agregar Membrana al Techo"
        name="has_roof_membrane"
      />

      {structureType === "Galpón" && !hasPanel && (
        <CheckboxInput
          label="Agregar Membrana a los laterales"
          name="has_sides_membrane"
        />
      )}
    </>
  );
};

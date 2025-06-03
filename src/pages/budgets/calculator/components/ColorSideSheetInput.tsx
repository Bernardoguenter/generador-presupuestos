import { useFormContext, useWatch } from "react-hook-form";
import { CheckboxInput } from "../../../../components";

export const ColorSideSheetInput = () => {
  const { control } = useFormContext();
  const structureType = useWatch({ control, name: "structure_type" });

  return (
    <>
      {structureType === "Galpón" && (
        <CheckboxInput
          name="color_side_sheet"
          label="Laterales a color?"
        />
      )}
    </>
  );
};

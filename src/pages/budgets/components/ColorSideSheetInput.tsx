import { useFormContext, useWatch } from "react-hook-form";
import { CheckboxInput } from "../../../components";
import { useEffect } from "react";

export const ColorSideSheetInput = () => {
  const { control, setValue } = useFormContext();
  const structureType = useWatch({ control, name: "structure_type" });
  const color_side_sheet = useWatch({ control, name: "color_side_sheet" });

  useEffect(() => {
    if (structureType !== "Galpón") {
      setValue("color_side_sheet", false);
      return;
    }
    setValue("color_side_sheet", color_side_sheet);
  }, [structureType, setValue, color_side_sheet]);

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

import { useEffect } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { NumberInput, CheckboxInput } from "../../../../components";

export const GutterInput = () => {
  const { control, setValue } = useFormContext();
  const hasGutter = useWatch({ control, name: "has_gutter" });
  const length = useWatch({ control, name: "length" });

  useEffect(() => {
    if (hasGutter) {
      setValue("gutter_metters", (length ?? 0) * 2);
    }
  }, [hasGutter, length, setValue]);

  // Limpia gutter_metters si has_gutter es false
  useEffect(() => {
    if (!hasGutter) {
      setValue("gutter_metters", undefined);
    }
  }, [hasGutter, setValue]);

  return (
    <div className="flex justify-between items-start">
      <CheckboxInput
        name="has_gutter"
        label="Agregar canaletas?"
      />
      {hasGutter && (
        <NumberInput
          label="Metros de canaleta"
          name="gutter_metters"
        />
      )}
    </div>
  );
};

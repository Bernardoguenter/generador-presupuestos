import { useEffect } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { NumberInput, CheckboxInput } from "../../../components";
import { Fieldset } from "../../../components/Fieldset";

export const GutterInput = () => {
  const { control, setValue } = useFormContext();
  const hasGutter = useWatch({ control, name: "has_gutter" });
  const length = useWatch({ control, name: "length" });

  useEffect(() => {
    if (hasGutter) {
      setValue("gutter_metters", (length ?? 0) * 2);
    }
  }, [hasGutter, length, setValue]);

  useEffect(() => {
    if (!hasGutter) {
      setValue("gutter_metters", 0);
    }
  }, [hasGutter, setValue]);

  return (
    <Fieldset title="Canaletas">
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
    </Fieldset>
  );
};

import { SelectInput } from "@/components";
import { usePreferencesContext } from "@/common/context";
import { useFormContext, useWatch } from "react-hook-form";

export const SidesSheetSelect = () => {
  const { preferences } = usePreferencesContext();
  const { sheets_options } = preferences;
  const { control } = useFormContext();
  const structureType = useWatch({ control, name: "structure_type" });

  return (
    <>
      {structureType === "Galpón" && (
        <SelectInput
          name="sides_sheets_option"
          label="Tipo de Chapa Lateral">
          <option value="Cincalum n°25 acanalada">
            Cincalum n°25 acanalada
          </option>
          <option value="Cincalum n°25 trapezoidal">
            Cincalum n°25 trapezoidal
          </option>
          {Object.keys(sheets_options).map((sheet) => (
            <option
              value={sheet}
              key={sheet}>
              {sheet}
            </option>
          ))}
        </SelectInput>
      )}
    </>
  );
};

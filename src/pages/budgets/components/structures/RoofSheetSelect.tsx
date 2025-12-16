import { SelectInput } from "@/components";
import { usePreferencesContext } from "@/common/context";

export const RoofSheetSelect = () => {
  const { preferences } = usePreferencesContext();
  const { sheets_options } = preferences;

  const filteredKeys = Object.keys(sheets_options).filter(
    (key) => !key.toLowerCase().includes("panel")
  );

  return (
    <SelectInput
      name="roof_sheets_option"
      label="Tipo de Chapa de Techo">
      <option value="Cincalum n°25 acanalada">Cincalum n°25 acanalada</option>
      <option value="Cincalum n°25 trapezoidal">
        Cincalum n°25 trapezoidal
      </option>
      {filteredKeys.map((sheet) => (
        <option
          value={sheet}
          key={sheet}>
          {sheet}
        </option>
      ))}
    </SelectInput>
  );
};

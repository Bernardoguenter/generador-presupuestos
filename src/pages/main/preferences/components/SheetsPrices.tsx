import { usePreferencesContext } from "@/common/context";
import { NumberInput, Fieldset } from "@/components";

export const SheetsPrices = () => {
  const { preferences } = usePreferencesContext();
  const { sheets_options } = preferences;

  return (
    <>
      <Fieldset title="Chapas y Membrana">
        <NumberInput
          name={`membrane_cost`}
          label={`Costo Membrana doble cara de aluminio 10 mm`}
        />
        {Object.entries(sheets_options).map(([key]) => (
          <NumberInput
            key={`sheets_options.${key}`}
            name={`sheets_options.${key}`}
            label={`${key}`}
          />
        ))}
      </Fieldset>
    </>
  );
};

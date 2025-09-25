import { usePreferencesContext } from "../../../../common/context";
import { NumberInput, Fieldset } from "../../../../components";

export const SolidWebPrices = () => {
  const { preferences } = usePreferencesContext();
  const { solid_web_price_list } = preferences;

  return (
    <>
      <Fieldset title="Alma LLena">
        {Object.entries(solid_web_price_list).map(([key]) => (
          <>
            <NumberInput
              key={`solid_web_price_list.${key}`}
              name={`solid_web_price_list.${key}`}
              label={`Ancho hasta ${key}m`}
            />
            <NumberInput
              key={`solid_web_columns_price_list.${key}`}
              name={`solid_web_columns_price_list.${key}`}
              label={`Columna Ancho hasta ${key}m`}
            />
          </>
        ))}
      </Fieldset>
    </>
  );
};

import { NumberInput, Fieldset } from "../../../../components";
import type { SolidWebPriceMap } from "../../../../helpers/types";

interface Props {
  solid_web_price_list: SolidWebPriceMap;
  solid_web_columns_price_list: SolidWebPriceMap;
}

export const SolidWebPrices = ({ solid_web_price_list }: Props) => {
  return (
    <>
      <Fieldset title="Alma LLena">
        {Object.entries(solid_web_price_list).map(([key]) => (
          <>
            {" "}
            <NumberInput
              key={key}
              name={`solid_web_price_list.${key}`}
              label={`Ancho hasta ${key} m2`}
            />
            <NumberInput
              key={key}
              name={`solid_web_columns_price_list.${key}`}
              label={`Columna Ancho hasta ${key} m`}
            />
          </>
        ))}
      </Fieldset>
    </>
  );
};

import { useMemo } from "react";
import { updateUserPreferences } from "../../../common/lib";
import { Button, Form, NumberInput } from "../../../components";
import type { ShedhousePriceMap } from "../../../helpers/types";
import {
  UpdatePricesToastError,
  UpdatePricesToastSuccess,
} from "../../../utils/alerts";
import { usePreferencesContext } from "../../../common/context";

export const PricesTinglado = () => {
  const { preferences, setIsLoading } = usePreferencesContext();
  const { company_id, shed_prices } = preferences;

  const handleSubmit = async (formData: ShedhousePriceMap) => {
    const formattedPrices: Record<string, number> = {};

    for (const [key, value] of Object.entries(formData)) {
      formattedPrices[key] = Number(value);
    }

    try {
      const dataToUpdate = { shed_prices: formattedPrices };
      const { error } = await updateUserPreferences(dataToUpdate, company_id);

      if (!error) {
        UpdatePricesToastSuccess();
        setIsLoading(true);
      } else {
        UpdatePricesToastError();
      }
    } catch (error) {
      console.error(error);
      UpdatePricesToastError();
    }
  };

  const defaultValues = useMemo<ShedhousePriceMap | undefined>(() => {
    if (!shed_prices) return undefined;
    return {
      ...shed_prices,
    };
  }, [shed_prices]);

  return (
    <Form
      className="mt-4"
      onSubmit={handleSubmit}
      defaultValues={defaultValues}>
      <h3 className="my-4 text-xl font-medium">Precios Tinglado</h3>
      {Object.entries(shed_prices).map(([area]) => (
        <NumberInput
          key={area}
          name={area}
          label={`Área ${area}`}
        />
      ))}
      <Button
        styles="mt-4 "
        type="submit"
        color="info">
        Actualizar precios Tinglado
      </Button>
    </Form>
  );
};

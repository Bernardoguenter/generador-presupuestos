import { useMemo } from "react";
import { updateUserPreferences } from "../../../common/lib";
import { NumberInput, Button, Form } from "../../../components";
import type { WharehousePriceMap } from "../../../helpers/types";
import {
  UpdatePricesToastError,
  UpdatePricesToastSuccess,
} from "../../../utils/alerts";
import { usePreferencesContext } from "../../../common/context";

export const PircesGalpon = () => {
  const { preferences, setIsLoading } = usePreferencesContext();
  const { company_id, wharehouse_prices } = preferences;

  const handleSubmit = async (formData: WharehousePriceMap) => {
    const formattedPrices: Record<string, number> = {};

    for (const [key, value] of Object.entries(formData)) {
      formattedPrices[key] = Number(value);
    }

    try {
      const dataToUpdate = { wharehouse_prices: formattedPrices };
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
  const defaultValues = useMemo<WharehousePriceMap | undefined>(() => {
    if (!wharehouse_prices) return undefined;
    return {
      ...wharehouse_prices,
    };
  }, [wharehouse_prices]);

  return (
    <Form
      onSubmit={handleSubmit}
      defaultValues={defaultValues}>
      <h3 className="my-4 text-xl font-medium">Precios Galpón</h3>
      {Object.entries(wharehouse_prices).map(([area]) => (
        <NumberInput
          key={area}
          name={area}
          label={`Área ${area}`}
        />
      ))}
      <Button
        styles="mt-4"
        type="submit"
        color="info">
        Actualizar recios Galpón
      </Button>
    </Form>
  );
};

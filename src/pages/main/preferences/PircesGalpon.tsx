import { usePreferencesContext } from "../../../common/context/PreferencesContext/PreferencesContext";
import { updateUserPreferences } from "../../../common/lib";
import { Button } from "../../../components/Button";
import { Form } from "../../../components/FormProvider";
import { NumberInput } from "../../../components/NumberInput";
import type { WharehousePriceMap } from "../../../helpers/types";
import {
  UpdatePricesToastError,
  UpdatePricesToastSuccess,
} from "../../../utils/alerts";

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

  return (
    <Form
      onSubmit={handleSubmit}
      defaultValues={wharehouse_prices}>
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

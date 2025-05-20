import { usePreferencesContext } from "../../../common/context/PreferencesContext/PreferencesContext";
import { Button } from "../../../components/Button";
import { Form } from "../../../components/FormProvider";
import { NumberInput } from "../../../components/NumberInput";
import type { ShedhousePriceMap } from "../../../helpers/types";
import {
  UpdatePricesToastError,
  UpdatePricesToastSuccess,
} from "../../../utils/alerts";
import { supabase } from "../../../utils/supabase";

export const PricesTinglado = () => {
  const { preferences, setIsLoading } = usePreferencesContext();
  const { company_id, shed_prices } = preferences;

  const handleSubmit = async (formData: ShedhousePriceMap) => {
    const formattedPrices: Record<string, number> = {};

    for (const [key, value] of Object.entries(formData)) {
      formattedPrices[key] = Number(value);
    }

    try {
      const { error } = await supabase
        .from("company_settings")
        .update({
          shed_prices: formattedPrices,
        })
        .eq("company_id", company_id)
        .select();

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
      className="mt-4"
      onSubmit={handleSubmit}
      defaultValues={shed_prices}>
      <h2 className="my-4 text-2xl font-medium">Precios Tinglado</h2>
      {Object.entries(shed_prices).map(([area]) => (
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
        Actualizar precios Galpón
      </Button>
    </Form>
  );
};

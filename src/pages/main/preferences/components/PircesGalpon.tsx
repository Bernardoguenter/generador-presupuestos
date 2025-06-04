import { useMemo } from "react";
import { updateUserPreferences } from "../../../../common/lib";
import { NumberInput, Button, Form } from "../../../../components";
import type { WharehousePriceMap } from "../../../../helpers/types";
import {
  UpdatePricesToastError,
  UpdatePricesToastSuccess,
} from "../../../../utils/alerts";
import { usePreferencesContext } from "../../../../common/context";
import SubmittingOverlay from "../../../../components/SubmittingOverlay";
import { useIsSubmitting } from "../../../../common/hooks/useIsSubmitting";

export const PircesGalpon = () => {
  const { preferences, setIsLoading } = usePreferencesContext();
  const { company_id, wharehouse_prices } = preferences;
  const { isSubmitting, setIsSubmitting } = useIsSubmitting();

  const handleSubmit = async (formData: WharehousePriceMap) => {
    const formattedPrices: Record<string, number> = {};

    for (const [key, value] of Object.entries(formData)) {
      formattedPrices[key] = Number(value);
    }

    try {
      setIsSubmitting(true);
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
    } finally {
      setIsSubmitting(false);
    }
  };
  const defaultValues = useMemo<WharehousePriceMap | undefined>(() => {
    if (!wharehouse_prices) return undefined;
    return {
      ...wharehouse_prices,
    };
  }, [wharehouse_prices]);

  return (
    <SubmittingOverlay isSubmitting={isSubmitting}>
      <Form
        onSubmit={handleSubmit}
        defaultValues={defaultValues}>
        <h3 className="my-4 text-xl font-medium">Precios Galpón</h3>
        {Object.entries(wharehouse_prices).map(([area]) => (
          <NumberInput
            key={area}
            name={area}
            label={`Área menor a ${area}`}
          />
        ))}
        <Button
          styles="mt-4"
          type="submit"
          color="info"
          disabled={isSubmitting}>
          Actualizar recios Galpón
        </Button>
      </Form>
    </SubmittingOverlay>
  );
};

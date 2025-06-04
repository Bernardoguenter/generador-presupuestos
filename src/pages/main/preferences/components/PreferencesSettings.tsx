import { useMemo } from "react";
import {
  Form,
  NumberInput,
  Button,
  SubmittingOverlay,
} from "../../../../components";
import { preferencesSchema, type PreferencesFormData } from "../schema";
import {
  UpdatePreferencesToastError,
  UpdatePreferencesToastSuccess,
} from "../../../../utils/alerts";
import { updateUserPreferences } from "../../../../common/lib";
import type { Preferences } from "../../../../helpers/types";
import { usePreferencesContext } from "../../../../common/context";
import { useIsSubmitting } from "../../../../common/hooks/useIsSubmitting";

export default function PreferencesSettings() {
  const { preferences, setIsLoading } = usePreferencesContext();
  const { isSubmitting, setIsSubmitting } = useIsSubmitting();

  const handleSubmit = async (formData: PreferencesFormData) => {
    try {
      setIsSubmitting(true);
      const { error } = await updateUserPreferences(
        formData,
        preferences.company_id
      );

      if (!error) {
        setIsLoading(true);
        UpdatePreferencesToastSuccess();
      } else {
        UpdatePreferencesToastError();
      }
    } catch (error) {
      console.error(error);
      UpdatePreferencesToastError();
    } finally {
      setIsSubmitting(false);
    }
  };

  const defaultValues = useMemo<Preferences | undefined>(() => {
    if (!preferences) return undefined;
    return {
      ...preferences,
    };
  }, [preferences]);

  return (
    <SubmittingOverlay isSubmitting={isSubmitting}>
      <Form
        defaultValues={defaultValues}
        onSubmit={handleSubmit}
        schema={preferencesSchema}>
        <NumberInput
          label="Cotización dólar"
          name="dollar_quote"
        />
        <NumberInput
          label="Porcentaje adicional"
          name="default_markup"
        />
        <NumberInput
          label="Precio Portón por m2"
          name="gate_price"
        />
        <NumberInput
          label="Precio por metro de canaleta"
          name="gutter_price"
        />
        <NumberInput
          label="Precio por Km de flete"
          name="km_price"
        />
        <NumberInput
          label="Diferencia Chapa Color"
          name="colored_sheet_difference"
        />
        <NumberInput
          label="Diferencia Alma Llena"
          name="solid_web_difference"
        />
        <NumberInput
          label="Diferencia Perfil U"
          name="u_profile_difference"
        />
        <NumberInput
          label="Costo columna Hierro torsionado"
          name="twisted_iron_column_cost"
        />
        <NumberInput
          label="Costo columna Alma Llena"
          name="solid_web_column_cost"
        />
        <NumberInput
          label="Costo columnas Perfil U"
          name="u_profile_column_cost"
        />
        <NumberInput
          label="Porcentaje de IVA"
          name="iva_percentage"
        />
        <Button
          styles="mt-4"
          type="submit"
          color="info"
          disabled={isSubmitting}>
          Actualizar Preferencias
        </Button>
      </Form>
    </SubmittingOverlay>
  );
}

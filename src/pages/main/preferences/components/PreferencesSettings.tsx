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
        <div className="w-full flex flex-col lg:flex-row lg:gap-8">
          <div className="flex flex-col w-full">
            <NumberInput
              label="Cotización dólar"
              name="dollar_quote"
            />
            <NumberInput
              label="Porcentaje adicional"
              name="default_markup"
            />
            <NumberInput
              label="Costo Hierro torsionado m2"
              name="twisted_iron_cost"
            />

            <NumberInput
              label="Costo Alma Llena m2"
              name="solid_web_cost"
            />
            <NumberInput
              label="Costo Perfil U m2"
              name="u_profile_cost"
            />
            <NumberInput
              label="Costo Cerramiento m2"
              name="enclousure_cost"
            />
            <NumberInput
              label="Precio Portón por m2"
              name="gate_price"
            />
          </div>
          <div className="flex flex-col  w-full">
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
          </div>
        </div>
        <div className="w-full flex justify-center">
          <Button
            styles="mt-4"
            type="submit"
            color="info"
            disabled={isSubmitting}>
            Actualizar Preferencias
          </Button>
        </div>
      </Form>
    </SubmittingOverlay>
  );
}

import { Form } from "../../../components/FormProvider";
import { preferencesSchema, type PreferencesFormData } from "./schema";
import { NumberInput } from "../../../components/NumberInput";
import { Button } from "../../../components/Button";
import { usePreferencesContext } from "../../../common/context/PreferencesContext/PreferencesContext";
import {
  UpdatePreferencesToastError,
  UpdatePreferencesToastSuccess,
} from "../../../utils/alerts";
import { updateUserPreferences } from "../../../common/lib";

export default function PreferencesSettings() {
  const { preferences, setIsLoading } = usePreferencesContext();

  const handleSubmit = async (formData: PreferencesFormData) => {
    try {
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
    }
  };

  return (
    <Form
      defaultValues={preferences}
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
        label="Precio Portón"
        name="gate_price"
      />
      <NumberInput
        label="Precio Km"
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
      <Button
        styles="mt-4"
        type="submit"
        color="info">
        Actualizar Preferencias
      </Button>
    </Form>
  );
}

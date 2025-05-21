import { Form } from "../../../components/FormProvider";
import { preferencesSchema, type PreferencesFormData } from "./schema";
import { NumberInput } from "../../../components/NumberInput";
import { Button } from "../../../components/Button";
import { supabase } from "../../../utils/supabase";
import { usePreferencesContext } from "../../../common/context/PreferencesContext/PreferencesContext";
import {
  UpdatePreferencesToastError,
  UpdatePreferencesToastSuccess,
} from "../../../utils/alerts";

export default function PreferencesSettings() {
  const { preferences, setIsLoading } = usePreferencesContext();

  const handleSubmit = async (formData: PreferencesFormData) => {
    try {
      const {
        colored_sheet_difference,
        u_profile_difference,
        default_markup,
        dollar_quote,
        gate_price,
        km_price,
      } = formData;
      const { error } = await supabase
        .from("company_settings")
        .update({
          colored_sheet_difference,
          default_markup,
          dollar_quote,
          gate_price,
          km_price,
          u_profile_difference,
        })
        .eq("company_id", preferences.company_id)
        .select();

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
      <h2 className="my-4 text-2xl font-medium">Preferencias</h2>
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

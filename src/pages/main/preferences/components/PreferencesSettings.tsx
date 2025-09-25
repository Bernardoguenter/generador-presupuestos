import { useMemo } from "react";
import { Form, Button, SubmittingOverlay } from "../../../../components";
import { preferencesSchema, type PreferencesFormData } from "../schema";
import {
  UpdatePreferencesToastError,
  UpdatePreferencesToastSuccess,
} from "../../../../utils/alerts";
import { updateUserPreferences } from "../../../../common/lib";
import type { Preferences } from "../../../../helpers/types";
import { usePreferencesContext } from "../../../../common/context";
import { useIsSubmitting } from "../../../../common/hooks/useIsSubmitting";
import { PreferencesGenerales } from "./PreferencesGenerales";
import { PreferencesEstrucutas } from "./PreferencesEstrucutas";
import { PreferencesSilos } from "./PreferencesSilos";

interface Props {
  preferencesView: "general" | "estructuras" | "silos";
}

export default function PreferencesSettings({ preferencesView }: Props) {
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
        {preferencesView === "general" && <PreferencesGenerales />}
        {preferencesView === "estructuras" && <PreferencesEstrucutas />}
        {preferencesView === "silos" && <PreferencesSilos />}
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

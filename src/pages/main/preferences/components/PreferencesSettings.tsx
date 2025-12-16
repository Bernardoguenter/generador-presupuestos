import { useMemo } from "react";
import { Form, Button, SubmittingOverlay } from "@/components";
import { preferencesSchema } from "../schema";
import type { Preferences } from "@/helpers/types";
import { usePreferencesContext } from "@/common/context";
import { PreferencesGenerales } from "./PreferencesGenerales";
import { PreferencesEstrucutas } from "./PreferencesEstrucutas";
import { PreferencesSilos } from "./PreferencesSilos";
import { useUpdatePreferences } from "./useUpdatePreferences";

interface Props {
  preferencesView: "general" | "estructuras" | "silos";
}

export default function PreferencesSettings({ preferencesView }: Props) {
  const { preferences } = usePreferencesContext();
  const { handleSubmit, isSubmitting } = useUpdatePreferences();

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

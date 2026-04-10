import { Form, Button, SubmittingOverlay } from "@/components";
import { preferencesSchema } from "../schema";
import { PreferencesGenerales } from "./PreferencesGenerales";
import { PreferencesEstrucutas } from "./PreferencesEstrucutas";
import { PreferencesSilos } from "./PreferencesSilos";
import { UpdateAllUserPreferencesButton } from "./UpdateAllUserPreferencesButton";
import { useUpdatePreferences } from "../hooks";

interface Props {
  preferencesView: "general" | "estructuras" | "silos";
}

export default function PreferencesSettings({ preferencesView }: Props) {
  const { handleSubmit, isSubmitting, defaultValues } = useUpdatePreferences();

  return (
    <SubmittingOverlay isSubmitting={isSubmitting}>
      <Form
        defaultValues={defaultValues}
        onSubmit={handleSubmit}
        schema={preferencesSchema}>
        {preferencesView === "general" && <PreferencesGenerales />}
        {preferencesView === "estructuras" && <PreferencesEstrucutas />}
        {preferencesView === "silos" && <PreferencesSilos />}
        <div className="w-full flex-col gap-2 flex justify-center">
          <Button
            styles="mt-4"
            type="submit"
            color="info"
            disabled={isSubmitting}>
            Actualizar Preferencias
          </Button>
          <UpdateAllUserPreferencesButton />
        </div>
      </Form>
    </SubmittingOverlay>
  );
}

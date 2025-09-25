import type { Preferences } from "../../../helpers/types";
import { useCompanyContext } from "../../../common/context";
import PreferencesSettings from "./components/PreferencesSettings";
import { PreferencesViewButtons } from "./components/PreferencesViewButtons";
import { useState } from "react";

export default function Preferences() {
  const { company } = useCompanyContext();
  const [preferencesView, setPreferencesView] = useState<
    "general" | "estructuras" | "silos"
  >("general");

  return (
    <section className="mt-8">
      <aside className="my-4 flex justify-between items-center">
        <h2 className="text-2xl font-medium">
          Preferencias {company?.company_name}
        </h2>
        <PreferencesViewButtons
          setPreferencesView={setPreferencesView}
          preferencesView={preferencesView}
        />
      </aside>

      <PreferencesSettings preferencesView={preferencesView} />
    </section>
  );
}

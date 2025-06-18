import type { Preferences } from "../../../helpers/types";
import { useCompanyContext } from "../../../common/context";
import PreferencesSettings from "./components/PreferencesSettings";

export default function Preferences() {
  const { company } = useCompanyContext();

  return (
    <section className="mt-8">
      <h2 className="my-4 text-2xl font-medium">
        Preferencias {company?.company_name}
      </h2>
      <PreferencesSettings />
    </section>
  );
}

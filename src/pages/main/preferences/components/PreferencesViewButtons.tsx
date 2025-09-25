import { Button } from "../../../../components";

interface Props {
  setPreferencesView: React.Dispatch<
    React.SetStateAction<"general" | "estructuras" | "silos">
  >;
  preferencesView: "general" | "estructuras" | "silos";
}

export const PreferencesViewButtons = ({
  setPreferencesView,
  preferencesView,
}: Props) => {
  return (
    <aside className="flex gap-1 md:flex-row flex-col">
      <Button
        color={preferencesView === "general" ? "info" : "danger"}
        onClick={() => setPreferencesView("general")}>
        General
      </Button>
      <Button
        color={preferencesView === "estructuras" ? "info" : "danger"}
        onClick={() => setPreferencesView("estructuras")}>
        Estructuras
      </Button>
      <Button
        color={preferencesView === "silos" ? "info" : "danger"}
        onClick={() => setPreferencesView("silos")}>
        Silos
      </Button>
    </aside>
  );
};

import { useState } from "react";
import PreferencesSettings from "./PreferencesSettings";
import { PriceSettings } from "./PriceSettings";
import type { Preferences } from "../../../helpers/types";
import { useCompanyContext } from "../../../common/context/CompanyContext/CompanyContext";

export default function Preferences() {
  const [view, setView] = useState<string>("preferences");
  const { company } = useCompanyContext();

  return (
    <section className="mt-8">
      <h2 className="my-4 text-2xl font-medium">
        Preferencias {company?.nombre}
      </h2>
      <div className="w-full flex justify-around ">
        <button
          onClick={() => setView("preferences")}
          className={`${
            view === "preferences"
              ? " bg-amber-500 shadow shadow-gray-500"
              : "bg-gray-500"
          } p-2 w-1/2 rounded `}>
          Preferencias
        </button>
        <button
          onClick={() => setView("prices")}
          className={`${
            view === "prices"
              ? " bg-amber-500 shadow shadow-gray-500"
              : "bg-gray-500"
          } p-2 w-1/2 rounded`}>
          Precios
        </button>
      </div>
      {view === "preferences" ? <PreferencesSettings /> : <PriceSettings />}
    </section>
  );
}

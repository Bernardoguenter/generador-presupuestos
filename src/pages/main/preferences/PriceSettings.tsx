import { useState } from "react";
import { PircesGalpon } from "./PircesGalpon";
import { PricesTinglado } from "./PricesTinglado";

export const PriceSettings = () => {
  const [view, setView] = useState<string>("galpón");

  return (
    <section className="">
      <h2 className="my-4 text-2xl font-medium">Selecciona la Estructura</h2>
      <div className="w-full flex justify-around ">
        <button
          onClick={() => setView("galpón")}
          className={`${
            view === "galpón"
              ? "bg-red-500 shadow shadow-gray-500"
              : " bg-gray-500"
          } p-2 w-1/2 rounded `}>
          Galpón
        </button>
        <button
          onClick={() => setView("tinglado")}
          className={`${
            view === "tinglado"
              ? " bg-red-500 shadow shadow-gray-500"
              : "bg-gray-500"
          } p-2 w-1/2 rounded`}>
          Tinglado
        </button>
      </div>
      {view === "galpón" ? <PircesGalpon /> : <PricesTinglado />}
    </section>
  );
};

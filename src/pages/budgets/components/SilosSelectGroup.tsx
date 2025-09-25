import { useEffect } from "react";
import { useFieldArray, useFormContext, useWatch } from "react-hook-form";
import { Button } from "../../../components";
import { SilosSelecType } from "./SilosSelecType";
import { SilosCapacity } from "./SilosCapacity";
import { SilosConeBase } from "./SilosConeBase";

export const SilosSelectGroup = () => {
  const { control, setValue } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "silos",
  });

  const silosValues = useWatch({ control, name: "silos" }) as
    | unknown[]
    | undefined;

  useEffect(() => {
    if (!silosValues) return;
    silosValues.forEach((silo: unknown, idx: number) => {
      const s = silo as Record<string, unknown> | undefined;
      if (
        s?.type === "airbase_silos" &&
        (s?.cone_base == null || s.cone_base === "")
      ) {
        setValue(`silos.${idx}.cone_base`, "estandar");
      }
      if (
        s?.type === "airbase_silos" &&
        (s?.capacity == null || s.capacity === "")
      ) {
        setValue(`silos.${idx}.capacity`, "6tn");
      }
    });
  }, [silosValues, setValue]);

  return (
    <>
      {fields.map((field, index) => {
        const sv = silosValues?.[index] as Record<string, unknown> | undefined;
        const type = sv?.type as string | undefined;
        return (
          <div
            key={field.id}
            className="flex flex-col gap-2 border p-3 rounded">
            <SilosSelecType index={index} />
            <SilosCapacity
              type={type}
              index={index}
            />
            {type === "airbase_silos" && <SilosConeBase index={index} />}
            {fields.length > 1 && (
              <Button
                type="button"
                onClick={() => remove(index)}
                color="danger">
                Eliminar
              </Button>
            )}
          </div>
        );
      })}
      <Button
        type="button"
        onClick={() => append({ type: "", capacity: "" })}
        color="info">
        + Agregar Silo
      </Button>
    </>
  );
};

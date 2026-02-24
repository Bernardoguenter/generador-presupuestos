import { useEffect } from "react";
import { useFieldArray, useFormContext, useWatch } from "react-hook-form";
import { Button, CheckboxInput } from "@/components";
import { SilosSelecType } from "./SilosSelecType";
import { SilosCapacity } from "./SilosCapacity";
import { SilosConeBase } from "./SilosConeBase";
import type { SiloFormValue } from "@/helpers/types";
import { EMPTY_SILO, VALID_FIBER_BASE_CAPACITIES } from "@/helpers/staticData";

export const SilosSelectGroup = () => {
  const { control, setValue } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "silos",
  });

  const silosValues = useWatch({
    control,
    name: "silos",
  }) as SiloFormValue[] | undefined;

  useEffect(() => {
    if (!silosValues) return;

    silosValues.forEach((silo, index) => {
      if (!silo) return;

      // Defaults para airbase
      if (silo.type === "airbase_silos") {
        if (!silo.cone_base) {
          setValue(`silos.${index}.cone_base`, "estandar", {
            shouldDirty: true,
            shouldTouch: false,
          });
        }

        if (!silo.capacity) {
          setValue(`silos.${index}.capacity`, "6tn", {
            shouldDirty: true,
            shouldTouch: false,
          });
        }
      }

      const canHaveFiberBase =
        silo.type === "feeder_silos" &&
        VALID_FIBER_BASE_CAPACITIES.includes(String(silo.capacity));

      if (!canHaveFiberBase && silo.has_fiber_base === true) {
        setValue(`silos.${index}.has_fiber_base`, false, {
          shouldDirty: true,
          shouldTouch: false,
        });
      }
    });
  }, [silosValues, setValue]);

  return (
    <>
      {fields.map((field, index) => {
        const sv = silosValues?.[index];
        const type = sv?.type;
        const capacity = sv?.capacity;
        const showFiberBase =
          type === "feeder_silos" &&
          VALID_FIBER_BASE_CAPACITIES.includes(String(capacity));

        return (
          <div
            key={field.id}
            className="flex flex-col gap-2 border p-3 rounded">
            <SilosSelecType index={index} />
            <SilosCapacity
              type={type}
              index={index}
            />
            {showFiberBase && (
              <CheckboxInput
                name={`silos.${index}.has_fiber_base`}
                label="Agregar Base de fibra"
              />
            )}

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
        onClick={() => append(EMPTY_SILO)}
        color="info">
        + Agregar Silo
      </Button>
    </>
  );
};

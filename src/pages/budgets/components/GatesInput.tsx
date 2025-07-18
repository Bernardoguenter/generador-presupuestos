import { useFieldArray, useFormContext, useWatch } from "react-hook-form";
import { NumberInput } from "../../../components";
import { useEffect, useRef } from "react";
import type { GatesMeasurements } from "../../../helpers/types";

export const GatesInput = () => {
  const { control, setValue } = useFormContext();
  const hasInitialized = useRef(false);
  const includesGate = useWatch({ control, name: "includes_gate" });
  const numberOfGates = useWatch({ control, name: "number_of_gates" });
  const height = useWatch({ control, name: "height" });
  const gates_measurementsWatch = useWatch({
    control,
    name: "gates_measurements",
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "gates_measurements",
  });

  useEffect(() => {
    if (!includesGate) {
      setValue("number_of_gates", 0);
      setValue("gates_measurements", []);
      hasInitialized.current = false;
      return;
    }

    if (includesGate && !hasInitialized.current) {
      setValue("number_of_gates", 1);
      setValue("gates_measurements", [{ width: 5, height: 4.5 }]);
      hasInitialized.current = true;
      return;
    }

    const currentCount = fields.length;
    if (numberOfGates > currentCount) {
      for (let i = currentCount; i < numberOfGates; i++) {
        append({ width: 0, height: 0 });
      }
    } else if (numberOfGates < currentCount) {
      for (let i = currentCount; i > numberOfGates; i--) {
        remove(i - 1);
      }
    }
  }, [numberOfGates, includesGate]);

  useEffect(() => {
    const parsedHeight =
      typeof height === "string" ? parseFloat(height) : height;

    if (
      !gates_measurementsWatch ||
      gates_measurementsWatch.length === 0 ||
      isNaN(parsedHeight)
    ) {
      return;
    }

    gates_measurementsWatch.forEach(
      (gate: GatesMeasurements, index: number) => {
        if (gate.height > parsedHeight || parsedHeight <= 4.5) {
          setValue(`gates_measurements.${index}.height`, parsedHeight);
        }
      }
    );
  }, [height]);

  if (!includesGate) return null;

  return (
    <div className="mt-4">
      <NumberInput
        label="Cantidad de portones"
        name="number_of_gates"
      />
      {fields.map((field, index) => (
        <div
          key={field.id}
          className="grid grid-cols-2 gap-4 mt-2">
          <NumberInput
            label={`Ancho del portón #${index + 1}`}
            name={`gates_measurements.${index}.width`}
          />
          <NumberInput
            label={`Alto del portón #${index + 1}`}
            name={`gates_measurements.${index}.height`}
          />
        </div>
      ))}
    </div>
  );
};

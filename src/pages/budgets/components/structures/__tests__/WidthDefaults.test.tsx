import { describe, it, expect } from "vitest";
import { render, act } from "@testing-library/react";
import { FormProvider, useForm, type UseFormReturn } from "react-hook-form";
import { WidthDefaults } from "../WidthDefaults";

let form: UseFormReturn<Record<string, unknown>>;
const Harness = ({ width }: { width: number }) => {
  form = useForm({
    defaultValues: {
      width,
      height: 7,
      enclousure_height: [6, 6, 6, 6],
      uniform_enclousure: true,
      gates_measurements: [{ width: 6, height: 6 }],
    },
  });
  return (
    <FormProvider {...form}>
      <WidthDefaults />
    </FormProvider>
  );
};

describe("WidthDefaults", () => {
  it("no pisa los valores al abrir, y los cambia al pasar de rango", async () => {
    render(<Harness width={15} />);
    expect(form.getValues("height")).toBe(7);

    await act(async () => form.setValue("width", 14));
    expect(form.getValues("height")).toBe(7); // mismo rango (más de 12)

    await act(async () => form.setValue("width", 10));
    expect(form.getValues("height")).toBe(4.5);
    expect(form.getValues("enclousure_height")).toEqual([4, 4, 4, 4]);
    expect(form.getValues("gates_measurements")).toEqual([{ width: 4.5, height: 4.5 }]);

    await act(async () => form.setValue("height", 6)); // cambio a mano
    await act(async () => form.setValue("width", 11));
    expect(form.getValues("height")).toBe(6);

    await act(async () => form.setValue("width", 13));
    expect(form.getValues("height")).toBe(5);
    expect(form.getValues("enclousure_height")).toEqual([4.5, 4.5, 4.5, 4.5]);
    expect(form.getValues("gates_measurements")).toEqual([{ width: 4.5, height: 5 }]);
  });
});

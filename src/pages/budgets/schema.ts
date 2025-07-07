import { z } from "zod";

export const calculateBudgetSchema = z
  .object({
    material: z.string({
      required_error: "Debes ingresar un marterial",
      invalid_type_error: "El material debe ser una cadena de texto",
    }),
    customer: z.string({
      required_error: "Debes ingresar un Cliente",
      invalid_type_error: "El cliente debe ser una cadena de texto",
    }),
    structure_type: z.string({
      required_error: "Debes ingresar un tipo de estructura",
      invalid_type_error: "El tipo de estructura debe ser una cadena de texto",
    }),
    width: z.coerce
      .number({
        required_error: "Debes ingresar un ancho para el presupuesto",
        invalid_type_error: "El ancho debe ser un número",
      })
      .nonnegative("La cotización debe ser un número positivo")
      .refine((n) => /^\d+(\.\d{1,2})?$/.test(n.toString()), {
        message: "El ancho debe tener como máximo 2 decimales",
      }),
    height: z.coerce
      .number({
        required_error: "Debes ingresar un alto para el presupuesto ",
        invalid_type_error: "El alto debe ser un número",
      })
      .nonnegative("El alto  debe ser un número positivo")
      .refine((n) => /^\d+(\.\d{1,2})?$/.test(n.toString()), {
        message: "El alto  debe tener como máximo 2 decimales",
      }),
    length: z.coerce
      .number({
        required_error: "Debes ingresar un largo para el presupuesto ",
        invalid_type_error: "El largo debe ser un número",
      })
      .nonnegative("El largo  debe ser un número positivo")
      .refine((n) => /^\d+(\.\d{1,2})?$/.test(n.toString()), {
        message: "El largo debe tener como máximo 2 decimales",
      }),
    enclousure_height: z.coerce
      .number({
        required_error:
          "Debes ingresar un alto del cerramiento para el presupuesto ",
        invalid_type_error: "El alto del cerramiento debe ser un número",
      })
      .nonnegative("El alto del cerramiento  debe ser un número positivo")
      .refine((n) => /^\d+(\.\d{1,2})?$/.test(n.toString()), {
        message: "El alto del cerramiento  debe tener como máximo 2 decimales",
      }),
    budget_markup: z.coerce
      .number({
        required_error: "Debes ingresar un margen extra para el presupuesto ",
        invalid_type_error: "El margen extra  debe ser un número",
      })
      .nonnegative("Elmargen extra debe ser un número positivo")
      .refine((n) => /^\d+(\.\d{1,2})?$/.test(n.toString()), {
        message: "El margen extra debe tener como máximo 2 decimales",
      }),
    includes_freight: z.boolean(),
    address: z.string().optional(),
    lng: z.coerce.number().optional(),
    lat: z.coerce.number().optional(),
    color_roof_sheet: z.boolean(),
    color_side_sheet: z.boolean(),
    includes_taxes: z.boolean(),
    includes_gate: z.boolean(),
    number_of_gates: z.coerce
      .number({
        invalid_type_error: "La cantidad de portones debe ser un número",
      })
      .int("La cantidad de portones debe ser un número entero")
      .nonnegative("La cantidad de portones debe ser un número positivo"),
    gates_measurements: z.array(
      z.object({
        width: z.coerce
          .number({
            required_error: "Debes ingresar el ancho del portón",
            invalid_type_error: "El ancho del portón debe ser un número",
          })
          .nonnegative("El ancho del portón debe ser un número positivo")
          .refine((n) => /^\d+(\.\d{1,2})?$/.test(n.toString()), {
            message: "El ancho del portón debe tener como máximo 2 decimales",
          }),
        height: z.coerce
          .number({
            required_error: "Debes ingresar el alto del portón",
            invalid_type_error: "El alto del portón debe ser un número",
          })
          .nonnegative("El alto del portón debe ser un número positivo")
          .refine((n) => /^\d+(\.\d{1,2})?$/.test(n.toString()), {
            message: "El alto del portón debe tener como máximo 2 decimales",
          }),
      })
    ),
    has_gutter: z.boolean(),
    gutter_metters: z.coerce.number({
      invalid_type_error: "El metraje de las canaletas debe ser un número",
    }),
  })
  .refine(
    (data) =>
      (!data.includes_gate && data.number_of_gates === 0) ||
      (data.includes_gate && data.number_of_gates > 0),
    {
      message:
        "Si el presupuesto incluye portón, la cantidad debe ser mayor a 0.",
      path: ["number_of_gates"],
    }
  )
  .refine(
    (data) =>
      !data.includes_gate ||
      (Array.isArray(data.gates_measurements) &&
        data.gates_measurements.length === data.number_of_gates &&
        data.gates_measurements.length > 0),
    {
      message:
        "Debes ingresar las medidas de todos los portones (alto y ancho) si el presupuesto los incluye.",
      path: ["gates_measurements"],
    }
  )
  .refine((data) => !data.has_gutter || data.gutter_metters > 0, {
    message:
      "Debes ingresar los metros de canaleta si el presupuesto incluye canaletas.",
    path: ["gutter_metters"],
  })
  .refine(
    (data) =>
      data.gates_measurements.every(
        (gate) => gate.width <= data.width && gate.height <= data.height
      ),
    {
      message:
        "Las medidas de los portones no pueden superar el ancho ni el alto general.",
      path: ["gates_measurements"],
    }
  )
  .refine((data) => data.gutter_metters <= data.length * 2, {
    message:
      "El metraje de las canaletas no puede ser mayor al doble del largo de la estructura.",
    path: ["gutter_metters"],
  })
  .refine(
    (data) =>
      !data.includes_freight ||
      (typeof data.address === "string" &&
        data.address.trim().length > 0 &&
        typeof data.lat === "number" &&
        typeof data.lng === "number"),
    {
      message:
        "Si el presupuesto incluye flete, debes ingresar la dirección y su ubicación.",
      path: ["address"],
    }
  );

export type BudgetFormData = z.infer<typeof calculateBudgetSchema>;

export const ConfirmPDFhema = z.object({
  description: z.string(),
  details: z.string(),
  paymentMethods: z.string(),
  total: z.coerce.number(),
  caption: z.string(),
});

export type ConfirmPDFFormData = z.infer<typeof ConfirmPDFhema>;

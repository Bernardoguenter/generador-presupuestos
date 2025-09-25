import { z } from "zod";

const commonSchema = z
  .object({
    customer: z.string({
      required_error: "Debes ingresar un Cliente",
      invalid_type_error: "El cliente debe ser una cadena de texto",
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
    includes_taxes: z.boolean(),
    distanceCalculation: z.string(),
    distanceInKms: z.coerce
      .number({
        invalid_type_error: "La distancia en kilómetros debe ser un número",
      })
      .int("La cantidad de kilómetros debe ser un número entero")
      .nonnegative("La distancia en kilómetros debe ser un número positivo"),
  })
  .refine(
    (data) => {
      if (!data.includes_freight) return true;
      if (data.distanceCalculation === "address") {
        return (
          typeof data.address === "string" &&
          data.address.trim().length > 0 &&
          typeof data.lat === "number" &&
          typeof data.lng === "number"
        );
      }
      return true;
    },
    {
      message:
        "Si el presupuesto incluye flete por dirección, debes ingresar la dirección y su ubicación.",
      path: ["address"],
    }
  )
  .refine(
    (data) => {
      if (!data.includes_freight) return true;
      if (data.distanceCalculation === "distance") {
        return typeof data.distanceInKms === "number" && data.distanceInKms > 0;
      }
      return true;
    },
    {
      message:
        "Si el presupuesto incluye flete por kilómetros, la distancia debe ser mayor a 0.",
      path: ["distanceCalculation"],
    }
  );

export const calculateSiloBudgetSchema = z
  .object({
    silos: z
      .array(
        z.object({
          type: z
            .string({
              required_error: "Debes ingresar el tipo de silo",
              invalid_type_error: "El tipo de silo debe ser un texto",
            })
            .min(1, "Debes ingresar el tipo de silo"),
          capacity: z
            .string({
              required_error: "Debes ingresar la capacidad del silo",
              invalid_type_error: "La capacidad debe ser un texto",
            })
            .min(1, "Debes ingresar la capacidad del silo"),
          cone_base: z.string().optional(),
        })
      )
      .min(1, "Debes agregar al menos un silo")
      .superRefine((silos, ctx) => {
        silos.forEach((silo, i) => {
          if (!silo.type || silo.type.trim().length === 0) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: "Debes ingresar el tipo de silo",
              path: [i, "type"],
            });
          } else if (
            silo.type !== "airbase_silos" &&
            silo.type !== "feeder_silos"
          ) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: "El tipo de silo debe ser 'Base Aérea' o 'Comederos'",
              path: [i, "type"],
            });
          }

          if (!silo.capacity || silo.capacity.trim().length === 0) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: "Debes ingresar la capacidad del silo",
              path: [i, "capacity"],
            });
          }

          // If silo is of type airbase_silos, cone_base is required and must be a valid option
          if (silo.type === "airbase_silos") {
            if (!silo.cone_base || String(silo.cone_base).trim().length === 0) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Debes seleccionar la base del cono para este silo",
                path: [i, "cone_base"],
              });
            } else if (
              !["estandar", "45", "55"].includes(String(silo.cone_base))
            ) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "La base del cono no es válida",
                path: [i, "cone_base"],
              });
            }
          }
        });
      }),
  })
  .and(commonSchema);

export const calculateStructureBudgetSchema = z
  .object({
    material: z.string({
      required_error: "Debes ingresar un marterial",
      invalid_type_error: "El material debe ser una cadena de texto",
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
      path: ["includes_gate"],
    }
  )
  .refine((data) => data.gutter_metters <= data.length * 2, {
    message:
      "El metraje de las canaletas no puede ser mayor al doble del largo de la estructura.",
    path: ["gutter_metters"],
  })
  .and(commonSchema);

export type StructureBudgetFormData = z.infer<
  typeof calculateStructureBudgetSchema
>;

export type SiloBudgetFormData = z.infer<typeof calculateSiloBudgetSchema>;

export const ConfirmPDFSchema = z.object({
  description: z.string(),
  details: z.string(),
  paymentMethods: z.string(),
  total: z.coerce.number(),
  caption: z.string(),
});

export const ConfirmSiloPDFSchema = z.object({
  description: z.array(z.string()),
  paymentMethods: z.string(),
  total: z.coerce.number(),
  caption: z.string(),
  silosPrices: z.array(z.coerce.number()).optional(),
});

export type ConfirmPDFFormData = z.infer<typeof ConfirmPDFSchema>;
export type ConfirmSiloPDFFormData = z.infer<typeof ConfirmSiloPDFSchema>;

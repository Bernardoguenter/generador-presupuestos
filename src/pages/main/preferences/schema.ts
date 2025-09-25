import { z } from "zod";

const solidWebPriceListSchema = z.object({
  8: z.coerce.number().positive(),
  12: z.coerce.number().positive(),
  16: z.coerce.number().positive(),
  20: z.coerce.number().positive(),
  25: z.coerce.number().positive(),
  30: z.coerce.number().positive(),
});

export const silosPriceSchema = z.record(
  z.string(),
  z.coerce
    .number({
      required_error: "Debes ingresar un precio",
      invalid_type_error: "El precio debe ser un número",
    })
    .positive("El precio debe ser un número positivo")
    .refine((n) => /^\d+(\.\d{1,2})?$/.test(n.toString()), {
      message: "El precio debe tener como máximo 2 decimales",
    })
);

export const preferencesSchema = z.object({
  dollar_quote: z.coerce
    .number({
      required_error: "Debes ingresar una cotización del dolar",
      invalid_type_error: "La cotización debe ser un número",
    })
    .nonnegative("La cotización debe ser un número positivo")
    .refine((n) => /^\d+(\.\d{1,2})?$/.test(n.toString()), {
      message: "La cotización debe tener como máximo 2 decimales",
    }),
  default_markup: z.coerce
    .number({
      invalid_type_error: "La cotización debe ser un número",
    })
    .nonnegative("El margen debe ser un número positivo")
    .refine((n) => /^\d+(\.\d{1,2})?$/.test(n.toString()), {
      message: "El margen debe tener como máximo 2 decimales",
    }),
  gate_price: z.coerce
    .number({
      required_error: "Debes ingresar un precio portón por m2",
      invalid_type_error: "El precio portón por m2 debe ser un número",
    })
    .nonnegative("El precio portón por m2 debe ser un número positivo")
    .refine((n) => /^\d+(\.\d{1,2})?$/.test(n.toString()), {
      message: "El precio portón por m2 tener como máximo 2 decimales",
    }),
  gutter_price: z.coerce
    .number({
      required_error: "Debes ingresar un precio de canaletas por metro",
      invalid_type_error: "El precio de canaletas por metro debe ser un número",
    })
    .nonnegative("precio de canaletas por metro debe ser un número positivo")
    .refine((n) => /^\d+(\.\d{1,2})?$/.test(n.toString()), {
      message:
        "precio de canaletas por metrodebe tener como máximo 2 decimales",
    }),
  km_price: z.coerce
    .number({
      required_error: "Debes ingresar un precio por km",
      invalid_type_error: "El precio por km debe ser un número",
    })
    .nonnegative("El precio por km debe ser un número positivo")
    .refine((n) => /^\d+(\.\d{1,2})?$/.test(n.toString()), {
      message: "El precio por km debe tener como máximo 2 decimales",
    }),
  colored_sheet_difference: z.coerce
    .number({
      required_error: "Debes ingresar un valor para diferencia chapa color",
      invalid_type_error: "La diferencia chapa color debe ser un número",
    })
    .nonnegative("La diferencia chapa color debe ser un número positivo")
    .refine((n) => /^\d+(\.\d{1,2})?$/.test(n.toString()), {
      message: "La diferencia chapa color debe tener como máximo 2 decimales",
    }),
  u_profile_cost: z.coerce
    .number({
      required_error: "Debes ingresar un valor para el costo de perfil U",
      invalid_type_error: "El costo de perfil U debe ser un número",
    })
    .nonnegative("El costo de perfil U debe ser un número positivo")
    .refine((n) => /^\d+(\.\d{1,2})?$/.test(n.toString()), {
      message: "El costo de  perfil U debe tener como máximo 2 decimales",
    }),
  twisted_iron_cost: z.coerce
    .number({
      required_error:
        "Debes ingresar un valor para el costo de hierro torsionado",
      invalid_type_error: "El costo de hierro torsionado debe ser un número",
    })
    .nonnegative("El costo de hierro torsionado debe ser un número positivo")
    .refine((n) => /^\d+(\.\d{1,2})?$/.test(n.toString()), {
      message:
        "El costo de hierro torsionado debe tener como máximo 2 decimales",
    }),
  enclousure_cost: z.coerce
    .number({
      required_error: "Debes ingresar un valor para el costo de cerramiento",
      invalid_type_error: "El costo de cerramiento debe ser un número",
    })
    .nonnegative("El costo de cerramiento debe ser un número positivo")
    .refine((n) => /^\d+(\.\d{1,2})?$/.test(n.toString()), {
      message: "El costo de cerramiento debe tener como máximo 2 decimales",
    }),
  iva_percentage: z.coerce
    .number({
      required_error: "Debes ingresar un valor el IVA",
      invalid_type_error: "El porcentaje del IVA debe ser un número",
    })
    .nonnegative("El porcentaje del IVAdebe ser un número positivo")
    .refine((n) => /^\d+(\.\d{1,2})?$/.test(n.toString()), {
      message: "El porcentaje del IVA debe tener como máximo 2 decimales",
    }),
  twisted_iron_column_cost: z.coerce
    .number({
      required_error:
        "Debes ingresar un para el costo de columnas de hierro torsionado",
      invalid_type_error:
        "el costo de columnas de hierro torsionado debe ser un número",
    })
    .nonnegative(
      "el costo de columnas de hierro torsionadodebe ser un número positivo"
    )
    .refine((n) => /^\d+(\.\d{1,2})?$/.test(n.toString()), {
      message:
        "el costo de columnas de hierro torsionado debe tener como máximo 2 decimales",
    }),
  u_profile_column_cost: z.coerce
    .number({
      required_error:
        "Debes ingresar un valor para el costo de columnas de Perfil U",
      invalid_type_error:
        "El costo de columnas de Perfil UA debe ser un número",
    })
    .nonnegative("El costo de columnas de Perfil U debe ser un número positivo")
    .refine((n) => /^\d+(\.\d{1,2})?$/.test(n.toString()), {
      message:
        "costo de columnas de Perfil U debe tener como máximo 2 decimales",
    }),
  solid_web_price_list: solidWebPriceListSchema,
  solid_web_columns_price_list: solidWebPriceListSchema,
  airbase_silos: silosPriceSchema,
  feeder_silos: silosPriceSchema,
});

export type PreferencesFormData = z.infer<typeof preferencesSchema>;

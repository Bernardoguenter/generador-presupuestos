import { z } from "zod";

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
      required_error: "Debes ingresar un precio portón",
      invalid_type_error: "El precio portón debe ser un número",
    })
    .nonnegative("El precio portón debe ser un número positivo")
    .refine((n) => /^\d+(\.\d{1,2})?$/.test(n.toString()), {
      message: "El precio base debe tener como máximo 2 decimales",
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
  solid_web_difference: z.coerce
    .number({
      required_error: "Debes ingresar un valor para diferencia alma llena",
      invalid_type_error: "La diferencia alma llena debe ser un número",
    })
    .nonnegative("La diferencia alma llena debe ser un número positivo")
    .refine((n) => /^\d+(\.\d{1,2})?$/.test(n.toString()), {
      message: "La diferencia alma llena debe tener como máximo 2 decimales",
    }),
  u_profile_difference: z.coerce
    .number({
      required_error: "Debes ingresar un valor para diferencia perfil U",
      invalid_type_error: "La diferencia perfil U debe ser un número",
    })
    .nonnegative("La diferencia perfil U debe ser un número positivo")
    .refine((n) => /^\d+(\.\d{1,2})?$/.test(n.toString()), {
      message: "La diferencia perfil U debe tener como máximo 2 decimales",
    }),
});

export type PreferencesFormData = z.infer<typeof preferencesSchema>;

export const galponPricesSchema = z.record(
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

export const tingladoPricesSchema = z.record(
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

export type GalponPricesFormData = z.infer<typeof galponPricesSchema>;
export type TingladoPricesFormData = z.infer<typeof tingladoPricesSchema>;
// ...existing code...

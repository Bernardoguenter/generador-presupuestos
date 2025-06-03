import { z } from "zod";

export const addressSchema = z.object({
  address: z.string().min(1, "Debes ingresar una dirección"),
  lat: z.number(),
  lng: z.number(),
});

export const createCompanySchema = z.object({
  company_name: z
    .string({
      required_error: "Debes ingresar un nombre para la empresa",
    })
    .min(1, "El nombre de la compañia es requerido"),
  email: z
    .string({
      required_error: "Debes ingresar un e-mail para la empresa",
    })
    .email({
      message: "El e-mail debe tener un formato válido",
    }),
  phone: z
    .string({
      required_error: "Debes ingresar un teléfono",
    })
    .min(1, "Debes ingresar un teléfono")
    .refine((val) => /^\d+$/.test(val), {
      message: "El teléfono debe contener solo números",
    }),
  address: z
    .string({
      required_error: "Debes ingresar una dirección para la empresa",
    })
    .min(1, "Debes ingresar una dirección"),
  lng: z.coerce.number(),
  lat: z.coerce.number(),
  file: z
    .instanceof(File, {
      message: "Debes subir un archivo de imagen",
    })
    .refine((file) => file.size > 0, {
      message: "El archivo no puede estar vacío",
    })
    .refine(
      (file) => ["image/jpeg", "image/png", "image/webp"].includes(file.type),
      {
        message: "El archivo debe ser una imagen válida (jpg, png o webp)",
      }
    )
    .refine((file) => file.size <= 512000, {
      message: "El archivo no debe superar los 500KB",
    })
    .optional(),
});

export type CreateCompanyFormData = z.infer<typeof createCompanySchema>;

export const companyLogoSchema = z.object({
  file: z
    .instanceof(File, {
      message: "Debes subir un archivo de imagen",
    })
    .refine((file) => file.size > 0, {
      message: "El archivo no puede estar vacío",
    })
    .refine(
      (file) => ["image/jpeg", "image/png", "image/webp"].includes(file.type),
      {
        message: "El archivo debe ser una imagen válida (jpg, png o webp)",
      }
    )
    .refine((file) => file.size <= 512000, {
      message: "El archivo no debe superar los 500KB",
    })
    .optional(),
});

export type CompanyLogoFormData = z.infer<typeof companyLogoSchema>;

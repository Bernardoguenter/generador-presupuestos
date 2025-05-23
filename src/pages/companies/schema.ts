import { z } from "zod";

export const createCompanySchema = z.object({
  nombre: z.string({
    required_error: "Debes ingresar un nombre para la empresa",
  }),
  email: z
    .string({
      required_error: "Debes ingresar un e-mail para la empresa",
    })
    .email({
      message: "El e-mail debe tener un formato válido",
    }),
  telefono: z
    .string({
      required_error: "Debes ingresar un teléfono",
    })
    .refine((val) => /^\d+$/.test(val), {
      message: "El teléfono debe contener solo números",
    }),
  direccion: z.string({
    required_error: "Debes ingresar una dirección para la empresa",
  }),
  localidad: z.string({
    required_error: "Debes ingresar una localidad",
  }),
  provincia: z.string({
    required_error: "Debes ingresar una localidad",
  }),
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

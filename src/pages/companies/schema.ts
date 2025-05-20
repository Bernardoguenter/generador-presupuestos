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
});

export type CreateCompanyFormData = z.infer<typeof createCompanySchema>;

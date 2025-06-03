import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string({
      required_error: "Debes ingresar un e-mail",
      invalid_type_error: "Ingresa tu e-mail en un formato correcto",
    })
    .email({
      message: "Formato de e-mail inválido",
    }),
  password: z
    .string({ required_error: "Debes ingresar el password" })
    .min(1, "Debes ingresar el password"),
});

export type LoginFormData = z.infer<typeof loginSchema>;

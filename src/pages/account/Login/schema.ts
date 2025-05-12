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
  password: z.string({ required_error: "Debes ingresar el password" }),
  /* .min(
      6,
      "El password debe contener al menos 6 caracteres, una mayúscula y un número"
    ), */
  /* .regex(
      /(?=.*[A-Z])(?=.*\d)/,
      "El password debe contener al menos una mayúscula y un número"
    ), */
});

export type LoginFormData = z.infer<typeof loginSchema>;

import { z } from "zod";

export const changePasswordSchema = z
  .object({
    password: z
      .string({ required_error: "Debes ingresar el password" })
      .min(
        6,
        "El password debe contener al menos 6 caracteres, una mayúscula y un número"
      )
      .regex(
        /(?=.*[A-Z])(?=.*\d)/,
        "El password debe contener al menos una mayúscula y un número"
      ),
    confirmPassword: z
      .string({ required_error: "Debes ingresar el password" })
      .min(
        6,
        "El password debe contener al menos 6 caracteres, una mayúscula y un número"
      )
      .regex(
        /(?=.*[A-Z])(?=.*\d)/,
        "El password debe contener al menos una mayúscula y un número"
      ),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Los passwords no coinciden",
  });

export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;

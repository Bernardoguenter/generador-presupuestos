import { changePasswordSchema, type ChangePasswordFormData } from "./schema";
import {
  ChangePasswordToastError,
  ChangePasswordToastSuccess,
} from "../../../utils/alerts";
import { Button, Form, PasswordInput } from "../../../components";
import {
  signOutUser,
  updateUser,
  updateUserPassword,
} from "../../../common/lib";
import { useMemo, useState } from "react";
import { useAuthContext } from "../../../common/context";

export const FormChangePassword = () => {
  const { handleLogout } = useAuthContext();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (formData: ChangePasswordFormData) => {
    const { password, confirmPassword } = formData;
    if (password !== confirmPassword) {
      return;
    }

    try {
      setIsSubmitting(true);
      const { data, error } = await updateUserPassword(password);

      if (error) {
        console.error("Error cambiando la contraseña:", error);
        ChangePasswordToastError();
      } else {
        if (data.user) {
          const { error: updateUserError } = await updateUser(
            { isPasswordChanged: true },
            data.user.id
          );
          if (!updateUserError) {
            const { error } = await signOutUser();
            if (!error) {
              ChangePasswordToastSuccess();
            }
          } else {
            ChangePasswordToastError();
          }
        }
      }
    } catch (error) {
      console.error("Error cambiando la contraseña:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const defaultValues = useMemo(
    () => ({
      password: "",
      confirmPassword: "",
    }),
    []
  );

  return (
    <Form
      onSubmit={handleSubmit}
      schema={changePasswordSchema}
      defaultValues={defaultValues}>
      <h2 className="mb-4 text-2xl text-center">
        Para usar tu cuenta debes cambiar tu password
      </h2>
      <PasswordInput
        name="password"
        label="Elige tu nuevo password"
      />
      <PasswordInput
        name="confirmPassword"
        label="Vuelve a escribir tu contraseña"
      />
      <Button
        type="submit"
        styles="mt-5 w-[90%] self-center"
        color="info"
        disabled={isSubmitting}>
        Cambiar password
      </Button>
      <Button
        type="submit"
        styles="mt-5 w-[90%] self-center"
        color="danger"
        onClick={handleLogout}>
        Salir y cambiar mi password más tarde
      </Button>
    </Form>
  );
};

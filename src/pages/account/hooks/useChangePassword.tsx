import { useMemo } from "react";
import { signOutUser, updateUser, updateUserPassword } from "@/common/lib";
import {
  ChangePasswordToastError,
  ChangePasswordToastSuccess,
} from "@/utils/alerts";
import type { ChangePasswordFormData } from "@/pages/account/ChangePassword/schema";
import { useIsSubmitting } from "@/common/hooks";

export const useChangePassword = () => {
  const { isSubmitting, setIsSubmitting } = useIsSubmitting();

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
            data.user.id,
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
    [],
  );

  return { handleSubmit, isSubmitting, defaultValues };
};

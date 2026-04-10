import { useNavigate } from "react-router";
import { useIsSubmitting } from "@/common/hooks/useIsSubmitting";
import { useMemo } from "react";
import { createUser, getUserByEmail, sendPassword } from "@/common/lib";
import {
  CreateUserRoleToastError,
  CreateUserToastError,
  CreateUserToastErrorDuplicated,
  CreateUserToastSuccess,
} from "@/utils/alerts";
import type { CreateUserFormData } from "../schema";

export const useCreateUserForm = () => {
  const navigate = useNavigate();
  const { isSubmitting, setIsSubmitting } = useIsSubmitting();

  const handleSubmit = async (formData: CreateUserFormData) => {
    try {
      setIsSubmitting(true);
      if (formData.company_id === "default") {
        CreateUserRoleToastError();
        return;
      }
      const { data: isDuplicated } = await getUserByEmail(formData.email);

      if (isDuplicated) {
        CreateUserToastErrorDuplicated(formData.email);
      } else {
        const { data, error } = await createUser(formData);
        if (error) {
          console.error("Error desde la edge function:", error);
          CreateUserToastError(error);
        } else {
          CreateUserToastSuccess(formData.email);
          if (data.password) {
            const { error } = await sendPassword(formData.email, data.password);
            if (!error) {
              navigate("/users");
            }
          }
        }
      }
    } catch (error) {
      console.error("Error al crear el usuario:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const defaultValues = useMemo(
    () => ({
      email: "",
      fullName: "",
      role: "usuario",
      company_id: "default",
    }),
    [],
  );

  return { handleSubmit, isSubmitting, defaultValues };
};

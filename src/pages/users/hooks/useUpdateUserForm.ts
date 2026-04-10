import { useNavigate } from "react-router";
import { updateUser } from "@/common/lib";
import { UpdateUserToastError, UpdateUserToastSuccess } from "@/utils/alerts";
import { useIsSubmitting } from "@/common/hooks/useIsSubmitting";
import type { CreateUserFormData } from "../schema";
import type { User } from "@/types";
import { useMemo } from "react";

export const useUpdateUserForm = (user: User | null) => {
  const navigate = useNavigate();
  const { isSubmitting, setIsSubmitting } = useIsSubmitting();

  const handleSubmit = async (formData: CreateUserFormData) => {
    try {
      setIsSubmitting(true);
      if (user?.id) {
        const { data, error } = await updateUser(formData, user.id);

        if (!error) {
          UpdateUserToastSuccess(data?.fullName);
          setTimeout(() => {
            navigate("/users");
          }, 1000);
        } else {
          UpdateUserToastError(error.message);
          console.error(error);
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const defaultValues = useMemo<CreateUserFormData | undefined>(() => {
    if (!user) return undefined;
    return {
      role: user.role,
      email: user.email,
      company_id: user.company_id,
      fullName: user.fullName,
    };
  }, [user]);

  return { handleSubmit, isSubmitting, defaultValues };
};

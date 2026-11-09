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
        // El apodo solo se manda si cambió (así no falla si la base todavía
        // no tiene la columna "nickname").
        const { nickname, ...rest } = formData;
        const newNickname = (nickname ?? "").trim();
        const dataToUpdate =
          newNickname !== (user.nickname ?? "")
            ? { ...rest, nickname: newNickname || null }
            : rest;
        const { data, error } = await updateUser(dataToUpdate, user.id);

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
      nickname: user.nickname ?? "",
    };
  }, [user]);

  return { handleSubmit, isSubmitting, defaultValues };
};

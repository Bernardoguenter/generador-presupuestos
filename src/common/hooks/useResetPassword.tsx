import { useNavigate } from "react-router";
import { useIsSubmitting } from "@/common/hooks/useIsSubmitting";
import { regeneratePassword, sendEmailResetPassword } from "@/common/lib";
import {
  ResetPasswordToastSuccess,
  ResetPasswordToastError,
} from "@/utils/alerts";
import type { ResetPasswordData } from "@/pages/account/ResetPassword/shema";

export const useResetPassword = () => {
  const navigate = useNavigate();
  const { isSubmitting, setIsSubmitting } = useIsSubmitting();

  const handleSubmit = async (formData: ResetPasswordData) => {
    try {
      setIsSubmitting(true);
      const { data: regenerateData, error: regenerateError } =
        await regeneratePassword(formData.email);

      if (regenerateError) {
        console.error(regenerateError);
      }

      const { error: sendPasswordError } = await sendEmailResetPassword(
        formData.email,
        regenerateData.password
      );

      if (!sendPasswordError) {
        ResetPasswordToastSuccess();
        setTimeout(() => {
          navigate("/accoount/login");
        }, 1000);
      }
    } catch (error) {
      ResetPasswordToastError();
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return { isSubmitting, handleSubmit };
};

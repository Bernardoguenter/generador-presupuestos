import { useIsSubmitting } from "@/common/hooks/useIsSubmitting";
import { loginUser } from "@/common/lib";
import type { LoginFormData } from "@/pages/account/Login/schema";
import { LoginSuccessToast, LoginErrorToast } from "@/utils/alerts";

export const useLogin = () => {
  const { isSubmitting, setIsSubmitting } = useIsSubmitting();

  const handleSubmit = async (formData: LoginFormData) => {
    try {
      setIsSubmitting(true);
      const { data, error } = await loginUser(
        formData.email,
        formData.password
      );

      if (error) {
        throw new Error(error.message);
      }

      if (data) {
        LoginSuccessToast(formData.email);
      }
    } catch (error) {
      LoginErrorToast();
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return { handleSubmit, isSubmitting };
};

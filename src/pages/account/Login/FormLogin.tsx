import { loginSchema, type LoginFormData } from "./schema";
import { LoginErrorToast, LoginSuccessToast } from "../../../utils/alerts";
import {
  Button,
  Form,
  TextInput,
  CustomLink,
  PasswordInput,
} from "../../../components";
import { loginUser } from "../../../common/lib";
import { useMemo } from "react";
import SubmittingOverlay from "../../../components/SubmittingOverlay";
import { useIsSubmitting } from "../../../common/hooks/useIsSubmitting";

export const FormLogin = () => {
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

  const defaultValues = useMemo(
    () => ({
      email: "",
      password: "",
    }),
    []
  );

  return (
    <SubmittingOverlay isSubmitting={isSubmitting}>
      <Form
        onSubmit={handleSubmit}
        schema={loginSchema}
        defaultValues={defaultValues}>
        <TextInput
          name="email"
          label="E-mail"
          type="email"
        />
        <PasswordInput
          name="password"
          label="Password"
        />
        <Button
          type="submit"
          styles="mt-5 w-[90%] self-center"
          color="info"
          disabled={isSubmitting}>
          Ingresar
        </Button>
        <CustomLink
          href="/account/reset-password"
          styles="text-center mt-4 underline">
          Olvidé mi clave
        </CustomLink>
      </Form>
    </SubmittingOverlay>
  );
};

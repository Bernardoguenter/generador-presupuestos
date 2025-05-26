import { loginSchema, type LoginFormData } from "./schema";
import { LoginErrorToast, LoginSuccessToast } from "../../../utils/alerts";
import { Button, Form, TextInput, CustomLink } from "../../../components";
import { loginUser } from "../../../common/lib";
import { useMemo } from "react";
import { PasswordInput } from "../../../components/PasswordInputs";

export const FormLogin = () => {
  const handleSubmit = async (formData: LoginFormData) => {
    try {
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
        color="info">
        Ingresar
      </Button>
      <CustomLink
        href="/account/reset-password"
        styles="text-center mt-4 underline">
        Olvidé mi clave
      </CustomLink>
    </Form>
  );
};

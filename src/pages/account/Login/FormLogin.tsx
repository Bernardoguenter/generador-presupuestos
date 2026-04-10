import { loginSchema } from "./schema";
import {
  Button,
  Form,
  TextInput,
  CustomLink,
  PasswordInput,
  SubmittingOverlay,
} from "@/components";
import { useLogin } from "../hooks";

export const FormLogin = () => {
  const { handleSubmit, isSubmitting, defaultValues } = useLogin();

  return (
    <SubmittingOverlay isSubmitting={isSubmitting}>
      <Form
        onSubmit={handleSubmit}
        schema={loginSchema}
        defaultValues={defaultValues}
        className="flex flex-col w-full items-center justify-center">
        <h2 className="text-center text-2xl font-medium">Iniciar sesión</h2>
        <div className="lg:w-[70vw] flex flex-col">
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
        </div>
      </Form>
    </SubmittingOverlay>
  );
};

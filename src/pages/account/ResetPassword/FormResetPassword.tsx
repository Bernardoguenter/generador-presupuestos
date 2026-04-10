import { resetPasswordSchema } from "./schema";
import {
  Button,
  CustomLink,
  Form,
  SubmittingOverlay,
  TextInput,
} from "@/components";
import { useResetPassword } from "../hooks";

export const FormResetPassword = () => {
  const { isSubmitting, handleSubmit, defaultValues } = useResetPassword();

  return (
    <SubmittingOverlay isSubmitting={isSubmitting}>
      <Form
        onSubmit={handleSubmit}
        schema={resetPasswordSchema}
        defaultValues={defaultValues}
        className="flex flex-col w-full items-center justify-center">
        <h2 className="mb-4 text-2xl text-center">Reseteo de Contraseña</h2>
        <p className="mb-4 text-xl text-center">
          Escribe tu e-mail y te enviaremos una nueva contraseña
        </p>
        <div className="lg:w-[70vw] flex flex-col">
          {" "}
          <TextInput
            name="email"
            label="E-mail"
            type="email"
          />
          <Button
            type="submit"
            styles="mt-5 self-center"
            color="info"
            disabled={isSubmitting}>
            Solicitar nuevo password{" "}
          </Button>
          <CustomLink
            href="account/login"
            color="danger"
            styles="mt-2 text-center self-center">
            Ingresar a mi cuenta
          </CustomLink>
        </div>
      </Form>
    </SubmittingOverlay>
  );
};

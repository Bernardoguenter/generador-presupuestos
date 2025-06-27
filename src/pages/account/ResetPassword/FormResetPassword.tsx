import { useNavigate } from "react-router";
import {
  ResetPasswordToastError,
  ResetPasswordToastSuccess,
} from "../../../utils/alerts";
import { resetPasswordSchema, type ResetPasswordData } from "./shema";
import {
  regeneratePassword,
  sendEmailResetPassword,
} from "../../../common/lib";
import {
  Button,
  CustomLink,
  Form,
  SubmittingOverlay,
  TextInput,
} from "../../../components";
import { useMemo } from "react";
import { useIsSubmitting } from "../../../common/hooks/useIsSubmitting";

export const FormResetPassword = () => {
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

  const defaultValues = useMemo(
    () => ({
      email: "",
    }),
    []
  );

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

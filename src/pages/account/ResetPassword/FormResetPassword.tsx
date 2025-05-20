import { useNavigate } from "react-router";
import { Button } from "../../../components/Button";
import { Form } from "../../../components/FormProvider";
import { TextInput } from "../../../components/TextInput";
import {
  ResetPasswordToastError,
  ResetPasswordToastSuccess,
} from "../../../utils/alerts";
import { supabase } from "../../../utils/supabase";
import { resetPasswordSchema, type ResetPasswordData } from "./shema";

export const FormResetPassword = () => {
  const navigate = useNavigate();
  const handleSubmit = async (formData: ResetPasswordData) => {
    try {
      const { data: regenerateData, error: regenerateError } =
        await supabase.functions.invoke("regenerate-password", {
          body: { email: formData.email },
        });

      if (regenerateError) {
        console.error(regenerateError);
      }

      const { error: sendPasswordError } = await supabase.functions.invoke(
        "send-reset-password",
        {
          body: { email: formData.email, password: regenerateData.password },
        }
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
    }
  };
  return (
    <Form
      onSubmit={handleSubmit}
      schema={resetPasswordSchema}
      defaultValues={{
        email: "",
      }}>
      <h2 className="mb-4 text-2xl text-center">
        Escribe tu e-mail y te enviaremos una nueva contraseña
      </h2>
      <TextInput
        name="email"
        label="E-mail"
        type="email"
      />
      <Button
        type="submit"
        color="info"
        children="Solcitar nuevo password"
      />
    </Form>
  );
};

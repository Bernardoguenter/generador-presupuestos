import { TextInput } from "../../../components/TextInput";
import { Form } from "../../../components/FormProvider";
import { loginSchema, type LoginFormData } from "./schema";
import { Button } from "../../../components/Button";
import { supabase } from "../../../utils/supabase";
import { LoginErrorToast, LoginSuccessToast } from "../../../utils/alerts";

export const FormLogin = () => {
  const handleSubmit = async (formData: LoginFormData) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

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

  return (
    <Form
      onSubmit={handleSubmit}
      schema={loginSchema}
      defaultValues={{
        email: "",
        password: "",
      }}>
      <TextInput
        name="email"
        label="E-mail"
        type="email"
      />
      <TextInput
        name="password"
        label="Password"
        type="password"
      />
      <Button
        type="submit"
        styles="mt-5 w-[90%] self-center"
        color="info">
        Ingresar
      </Button>
    </Form>
  );
};

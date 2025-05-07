import { TextInput } from "../../../components/TextInput";
import { Form } from "../../../components/FormProvider";
import { loginSchema, type LoginFormData } from "./schema";
import { Button } from "../../../components/Button";
import { supabase } from "../../../utils/supabase";
import { useNavigate } from "react-router";

export const FormLogin = () => {
  const navigate = useNavigate();

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
        console.log("data del login", data);
        alert("Usuario Logueado");
        setTimeout(() => {
          navigate("/");
        }, 2000);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Form
      onSubmit={handleSubmit}
      schema={loginSchema}>
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

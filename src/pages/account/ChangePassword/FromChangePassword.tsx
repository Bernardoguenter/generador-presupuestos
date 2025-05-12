import { TextInput } from "../../../components/TextInput";
import { Form } from "../../../components/FormProvider";
import { Button } from "../../../components/Button";
import { supabase } from "../../../utils/supabase";
import { changePasswordSchema, type ChangePasswordFormData } from "./schema";
import {
  ChangePasswordToastError,
  ChangePasswordToastSuccess,
} from "../../../utils/alerts";
import { useAuthContext } from "../../../common/context/AuthContext/AuthContext";

export const FormChangePassword = () => {
  const { handleLogout } = useAuthContext();

  const handleSubmit = async (formData: ChangePasswordFormData) => {
    const { password, confirmPassword } = formData;
    if (password !== confirmPassword) {
      return;
    }

    try {
      const { data, error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) {
        console.error("Error cambiando la contraseña:", error);
        ChangePasswordToastError();
      } else {
        const { error: updateUserError } = await supabase
          .from("users")
          .update({ isPasswordChanged: true })
          .eq("id", data.user.id);

        if (!updateUserError) {
          const { error } = await supabase.auth.signOut();
          if (!error) {
            ChangePasswordToastSuccess();
          }
        } else {
          ChangePasswordToastError();
        }
      }
    } catch (error) {
      console.error("Error cambiando la contraseña:", error);
    }
  };

  return (
    <Form
      onSubmit={handleSubmit}
      schema={changePasswordSchema}
      defaultValues={{
        password: "",
        confirmPassword: "",
      }}>
      <h2 className="mb-4 text-2xl text-center">
        Para usar tu cuenta debes cambiar tu password
      </h2>
      <TextInput
        name="password"
        label="Elige tu nuevo password"
        type="password"
      />
      <TextInput
        name="confirmPassword"
        label="Vuelve a escribir tu contraseña"
        type="password"
      />
      <Button
        type="submit"
        styles="mt-5 w-[90%] self-center"
        color="info">
        Cambiar password
      </Button>
      <Button
        type="submit"
        styles="mt-5 w-[90%] self-center"
        color="danger"
        onClick={handleLogout}>
        Salir y cambiar mi password más tarde
      </Button>
    </Form>
  );
};

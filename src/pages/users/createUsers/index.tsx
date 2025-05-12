import { useNavigate } from "react-router";
import { Button } from "../../../components/Button";
import { Form } from "../../../components/FormProvider";
import { TextInput } from "../../../components/TextInput";
import {
  CreateUserToastError,
  CreateUserToastErrorDuplicated,
  CreateUserToastSuccess,
} from "../../../utils/alerts";
import { supabase } from "../../../utils/supabase";
import { createUserSchema, type CreateUserFormData } from "../schema";

export default function CreateUsers() {
  const navigate = useNavigate();
  const handleSubmit = async (formData: CreateUserFormData) => {
    try {
      const isDuplicated = await supabase
        .from("users")
        .select("email")
        .eq("email", formData.email)
        .single();
      if (isDuplicated.data) {
        CreateUserToastErrorDuplicated(formData.email);
      } else {
        const { data, error } = await supabase.functions.invoke("create-user", {
          body: { email: formData.email },
        });
        if (error) {
          console.error("Error desde la edge function:", error);
          CreateUserToastError(error);
        } else {
          CreateUserToastSuccess(formData.email);
          if (data.password) {
            await supabase.functions.invoke("send-password", {
              body: { email: formData.email, password: data.password },
            });
          }
          navigate("/users");
        }
      }
    } catch (error) {
      console.error("Error al crear el usuario:", error);
    }
  };

  return (
    <Form
      onSubmit={handleSubmit}
      schema={createUserSchema}
      defaultValues={{
        email: "",
      }}>
      <TextInput
        label="E-mail"
        name="email"
        type="email"
      />
      <Button
        type="submit"
        color="info"
        children="Crear Usuario"
      />
    </Form>
  );
}

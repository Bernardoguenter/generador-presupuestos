import { useNavigate } from "react-router";
import { Button } from "../../../components/Button";
import { Form } from "../../../components/FormProvider";
import { TextInput } from "../../../components/TextInput";
import {
  CreateUserRoleToastError,
  CreateUserToastError,
  CreateUserToastErrorDuplicated,
  CreateUserToastSuccess,
} from "../../../utils/alerts";
import { supabase } from "../../../utils/supabase";
import { createUserSchema, type CreateUserFormData } from "../schema";
import { RolesSelect } from "../components/RolesSelect";
import { CompanySelect } from "../components/CompanySelect";

export default function CreateUsers() {
  const navigate = useNavigate();

  const handleSubmit = async (formData: CreateUserFormData) => {
    try {
      const { email, fullName, company_id, role } = formData;
      if (company_id === "default") {
        CreateUserRoleToastError();
        return;
      }

      const isDuplicated = await supabase
        .from("users")
        .select("email")
        .eq("email", email)
        .single();

      if (isDuplicated.data) {
        CreateUserToastErrorDuplicated(email);
      } else {
        const { data, error } = await supabase.functions.invoke("create-user", {
          body: { email, fullName, company_id, role },
        });
        if (error) {
          console.error("Error desde la edge function:", error);
          CreateUserToastError(error);
        } else {
          CreateUserToastSuccess(email);
          if (data.password) {
            await supabase.functions.invoke("send-password", {
              body: { email, password: data.password },
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
        fullName: "",
        role: "usuario",
        company_id: "default",
      }}>
      <h2 className="my-4 text-2xl font-medium">Crea un nuevo usuario</h2>
      <TextInput
        label="Nombre completo"
        name="fullName"
        type="text"
      />
      <TextInput
        label="E-mail"
        name="email"
        type="email"
      />

      <RolesSelect />
      <CompanySelect />
      <Button
        type="submit"
        color="info"
        children="Crear Usuario"
        styles="mt-4"
      />
    </Form>
  );
}

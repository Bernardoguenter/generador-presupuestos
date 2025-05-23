import { useNavigate } from "react-router";
import { Button, Form, TextInput } from "../../../components";
import {
  CreateUserRoleToastError,
  CreateUserToastError,
  CreateUserToastErrorDuplicated,
  CreateUserToastSuccess,
} from "../../../utils/alerts";
import { createUserSchema, type CreateUserFormData } from "../schema";
import { RolesSelect } from "../components/RolesSelect";
import { CompanySelect } from "../components/CompanySelect";
import { createUser, getUserByEmail, sendPassword } from "../../../common/lib";
import { useMemo } from "react";

export default function CreateUsers() {
  const navigate = useNavigate();

  const handleSubmit = async (formData: CreateUserFormData) => {
    try {
      if (formData.company_id === "default") {
        CreateUserRoleToastError();
        return;
      }
      const { data: isDuplicated } = await getUserByEmail(formData.email);

      if (isDuplicated) {
        CreateUserToastErrorDuplicated(formData.email);
      } else {
        const { data, error } = await createUser(formData);
        if (error) {
          console.error("Error desde la edge function:", error);
          CreateUserToastError(error);
        } else {
          CreateUserToastSuccess(formData.email);
          if (data.password) {
            const { error } = await sendPassword(formData.email, data.password);
            if (!error) {
              navigate("/users");
            }
          }
        }
      }
    } catch (error) {
      console.error("Error al crear el usuario:", error);
    }
  };

  const defaultValues = useMemo(
    () => ({
      email: "",
      fullName: "",
      role: "usuario",
      company_id: "default",
    }),
    []
  );

  return (
    <Form
      onSubmit={handleSubmit}
      schema={createUserSchema}
      defaultValues={defaultValues}>
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

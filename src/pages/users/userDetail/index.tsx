import { useEffect, useState } from "react";
import { useParams } from "react-router";
import type { User } from "@/types";
import { Button, TextInput, Form, SubmittingOverlay } from "@/components";
import { createUserSchema } from "../schema";
import { getUserById } from "@/common/lib";
import { DeleteUserButton } from "./DeleteUserButton";
import { useUpdateUserForm } from "../hooks";
import { CompanySelect, RolesSelect } from "../components";

export default function UserDetail() {
  const { id } = useParams();
  const [user, setUser] = useState<User | null>(null);
  const { isSubmitting, handleSubmit, defaultValues } = useUpdateUserForm(user);

  useEffect(() => {
    if (id) {
      const getUser = async (id: string) => {
        try {
          const { data, error } = await getUserById(id);

          if (!error) {
            setUser(data);
          }
        } catch (error) {
          console.error(error);
        }
      };
      getUser(id);
    }
  }, [id]);

  if (!user) return <h2>No se encontró información para este usuario</h2>;

  return (
    <SubmittingOverlay isSubmitting={isSubmitting}>
      <Form
        onSubmit={handleSubmit}
        schema={createUserSchema}
        defaultValues={defaultValues}>
        <h2 className="my-4 text-2xl font-medium"> {user?.fullName}</h2>
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
        <div className="w-full flex flex-col items-center justify-center">
          <Button
            type="submit"
            color="info"
            children="Editar usuario"
            styles="mt-4"
            disabled={isSubmitting}
          />
          <DeleteUserButton
            isSubmitting={isSubmitting}
            email={user.email}
            id={user.id}
          />
        </div>
      </Form>
    </SubmittingOverlay>
  );
}

import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";
import type { User } from "../../../helpers/types";
import { RolesSelect } from "../components/RolesSelect";
import { CompanySelect } from "../components/CompanySelect";
import {
  Button,
  TextInput,
  Form,
  SubmittingOverlay,
} from "../../../components";
import { createUserSchema, type CreateUserFormData } from "../schema";
import {
  UpdateUserToastError,
  UpdateUserToastSuccess,
} from "../../../utils/alerts";
import { getUserById, updateUser } from "../../../common/lib";
import { DeleteUserButton } from "./DeleteUserButton";
import { useIsSubmitting } from "../../../common/hooks/useIsSubmitting";

export default function UserDetail() {
  const { id } = useParams();
  const [user, setUser] = useState<User | null>(null);
  const { isSubmitting, setIsSubmitting } = useIsSubmitting();
  const navigate = useNavigate();

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

  const handleSubmit = async (formData: CreateUserFormData) => {
    try {
      setIsSubmitting(true);
      if (id) {
        const { data, error } = await updateUser(formData, id);

        if (!error) {
          UpdateUserToastSuccess(data?.fullName);
          setTimeout(() => {
            navigate("/users");
          }, 1000);
        } else {
          UpdateUserToastError(error.message);
          console.error(error);
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const defaultValues = useMemo<CreateUserFormData | undefined>(() => {
    if (!user) return undefined;
    return {
      role: user.role,
      email: user.email,
      company_id: user.company_id,
      fullName: user.fullName,
    };
  }, [user]);

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
      </Form>
    </SubmittingOverlay>
  );
}

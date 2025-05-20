import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import type { User } from "../../../helpers/types";
import { supabase } from "../../../utils/supabase";
import { Button } from "../../../components/Button";
import { TextInput } from "../../../components/TextInput";
import { Form } from "../../../components/FormProvider";
import { RolesSelect } from "../components/RolesSelect";
import { CompanySelect } from "../components/CompanySelect";
import { createUserSchema, type CreateUserFormData } from "../schema";
import {
  DeleteUserToastError,
  UpdateUserToastError,
  UpdateUserToastSuccess,
} from "../../../utils/alerts";
import useSweetAlertModal from "../../../common/hooks";

export default function UserDetail() {
  const { id } = useParams();
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();
  const { showAlert } = useSweetAlertModal();

  useEffect(() => {
    if (id) {
      const getUser = async (id: string) => {
        try {
          const { data, error } = await supabase
            .from("users")
            .select("*")
            .eq("id", id)
            .single();

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
    const { company_id, email, fullName, role } = formData;
    try {
      const { data, error } = await supabase
        .from("users")
        .update({
          company_id,
          email,
          fullName,
          role,
        })
        .eq("id", id)
        .select()
        .single();

      if (!error) {
        UpdateUserToastSuccess(data?.fullName);
        setTimeout(() => {
          navigate("/users");
        }, 1000);
      } else {
        UpdateUserToastError(error.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteUser = async (id: string, email: string) => {
    try {
      if (id && email) {
        const result = await showAlert({
          title: "¿Estás seguro?",
          text: `Esta acción eliminará al usuario ${email} y no se puede deshacer`,
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#FF8303",
          cancelButtonColor: "#ff3503",
          confirmButtonText: "Sí, eliminar",
          cancelButtonText: "Cancelar",
        });

        if (result.isConfirmed) {
          const { error } = await supabase.functions.invoke("delete-user", {
            body: { id: id },
          });

          if (!error) {
            await showAlert({
              title: "¡Eliminado!",
              text: `El usuario ${email} fue eliminado correctamente.`,
              icon: "success",
              confirmButtonColor: "#FF8303",
            });
          } else {
            DeleteUserToastError(email);
          }
        }
      }
    } catch (error) {
      console.error(error);
      DeleteUserToastError(email);
    }
  };

  const defaultValues: CreateUserFormData | undefined = user
    ? (() => {
        return {
          role: user.role,
          email: user.email,
          company_id: user.company_id,
          fullName: user.fullName,
        };
      })()
    : undefined;

  if (!user) return <h2>No se encontró información para este usuario</h2>;

  return (
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
      />
      <Button
        type="button"
        color="danger"
        children="Eliminar usuario"
        styles="mt-4"
        onClick={() => handleDeleteUser(user?.id, user?.email)}
      />
    </Form>
  );
}

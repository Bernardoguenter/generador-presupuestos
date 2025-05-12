import { useEffect, useState } from "react";
import { CustomLink } from "../../../../components/CustomLink";
import type { User } from "../../../../helpers/types";
import { supabase } from "../../../../utils/supabase";
import { DeleteIcon, EditIcon } from "../../../../assets/svg";
import { DeleteUserToastError } from "../../../../utils/alerts";
import useSweetAlertModal from "../../../../common/hooks";

export const UserList = () => {
  const [users, setUsers] = useState<User[] | null>(null);
  const { showAlert } = useSweetAlertModal();

  useEffect(() => {
    const getAllUsers = async () => {
      const { data: users, error } = await supabase.from("users").select("*");
      if (error) {
        throw new Error("Error al obtener usuarios");
      }
      setUsers(users);
    };

    getAllUsers();
  }, []);

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
            const newUsers = users?.filter((user) => user.id !== id);
            if (newUsers) {
              setUsers(newUsers);
            }
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

  return (
    <table className="max-w-full shadow-md overflow-hidden border rounded divide-y divide-gray-100">
      <thead className="rounded">
        <tr>
          <th className="px-2 py-2 text-left text-sm font-medium ">E-mail</th>
          <th className="px-2 py-2 text-center text-sm font-medium ">
            Eliminar
          </th>
          <th className="px-2 py-2 text-center text-sm font-medium ">Editar</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-50">
        {users?.length === 0 ? (
          <tr>
            <td
              colSpan={3}
              className="text-center py-4">
              No se encontraron usuarios
            </td>
          </tr>
        ) : (
          users?.map((user) => (
            <tr key={user.id}>
              <td className="px-2 py-2 text-xs overflow-hidden">
                {user.email}
              </td>
              <td className="px-2 py-2 text-center ">
                <button onClick={() => handleDeleteUser(user.id, user.email)}>
                  <DeleteIcon />
                </button>
              </td>
              <td className="px-2 py-2 text-center ">
                <CustomLink href="/">
                  <EditIcon />
                </CustomLink>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
};

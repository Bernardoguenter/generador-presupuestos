import { useEffect, useState } from "react";
import { CustomLink } from "../../../../components/CustomLink";
import type { User } from "../../../../helpers/types";
import { DeleteIcon, EditIcon } from "../../../../assets/svg";
import { DeleteUserToastError } from "../../../../utils/alerts";
import useSweetAlertModal from "../../../../common/hooks";
import { deleteUser, getAllUsers } from "../../../../common/lib";

export const UserList = () => {
  const [users, setUsers] = useState<User[] | null>(null);
  const { showAlert } = useSweetAlertModal();

  useEffect(() => {
    const getUsers = async () => {
      const { data: users, error } = await getAllUsers();
      if (error) {
        throw new Error("Error al obtener usuarios");
      }
      setUsers(users);
    };

    getUsers();
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
          const { error } = await deleteUser(id);
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
      <thead className="rounded ">
        <tr className="flex items-center w-full ">
          <th className="px-2 py-2 text-left text-sm font-medium w-2/4">
            Nombre Completo
          </th>
          <th className="px-2 py-2 text-center text-sm font-medium w-1/4">
            Eliminar
          </th>
          <th className="px-2 py-2 text-center text-sm font-medium w-1/4 ">
            Editar
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-50 w-full">
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
            <tr
              key={user.id}
              className="flex items-center w-full ">
              <td className="px-2 py-2 text-xs overflow-hidden w-2/4">
                {user.fullName}
              </td>
              <td className="px-2 py-2 flex justify-center items-center w-1/4">
                <button onClick={() => handleDeleteUser(user.id, user.email)}>
                  <DeleteIcon />
                </button>
              </td>
              <td className="px-2 py-2 w-1/4 ">
                <CustomLink
                  href={`${user.id}`}
                  styles="flex items-center justify-center">
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

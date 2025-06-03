import { useEffect, useState } from "react";
import { CustomLink } from "../../../../components";
import type { User } from "../../../../helpers/types";
import { EditIcon } from "../../../../assets/svg";
import { getAllUsers } from "../../../../common/lib";
import { DeleteUserButton } from "./DeleteUserButton";
import { useAuthContext } from "../../../../common/context";

export const UserList = () => {
  const [users, setUsers] = useState<User[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { id } = useAuthContext();

  useEffect(() => {
    if (id) {
      const getUsers = async () => {
        const { data: users, error } = await getAllUsers(id);
        if (!error) {
          setUsers(users);
        } else {
          throw new Error("Error al obtener usuarios");
        }
        setIsLoading(false);
      };
      getUsers();
    }
  }, [isLoading, id]);

  return (
    <table className="max-w-full shadow-md overflow-hidden border rounded divide-y divide-gray-100">
      <thead className="rounded ">
        <tr className="flex items-center w-full ">
          <th className="px-2 py-2 text-left text-sm font-medium w-2/6">
            Nombre Completo
          </th>
          <th className="px-2 py-2 text-left text-sm font-medium w-2/6">
            Tipo de usuario
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
              <td className="px-2 py-2 text-xs overflow-hidden w-2/6">
                {user.fullName}
              </td>
              <td className="px-2 py-2 text-xs overflow-hidden w-2/6">
                {user.role}
              </td>
              <td className="px-2 py-2 flex justify-center items-center w-1/6">
                <DeleteUserButton
                  email={user.email}
                  id={user.id}
                  setIsLoading={setIsLoading}
                />
              </td>
              <td className="px-2 py-2 w-1/6 flex justify-center items">
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

import { useEffect, useState } from "react";
import { CustomLink, Pagination, SearchInput } from "../../../../components";
import type { User } from "../../../../helpers/types";
import { EditIcon } from "../../../../assets/svg";
import { getAllUsers } from "../../../../common/lib";
import { DeleteUserButton } from "./DeleteUserButton";
import { useAuthContext } from "../../../../common/context";
import { usePaginatedData } from "../../../../common/hooks";
import { UseSearchableTable } from "../../../../common/hooks/useSerchableTable";

export const UserList = () => {
  const [users, setUsers] = useState<User[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { id } = useAuthContext();

  useEffect(() => {
    if (id) {
      getUsers(id);
    }
  }, [id]);

  const getUsers = async (id: string) => {
    try {
      setIsLoading(true);
      const { data: users, error } = await getAllUsers(id);
      if (!error) {
        setUsers(users);
      } else {
        throw new Error("Error al obtener usuarios");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const {
    searchInput,
    setSearchInput,
    filteredData: filteredUsers,
  } = UseSearchableTable<User>({
    data: users || [],
    filterFn: (user, search) =>
      [user.fullName, user.email, user.role]
        .filter(Boolean)
        .some((field) => field!.toLowerCase().includes(search.toLowerCase())),
  });

  const {
    paginatedData,
    currentPage,
    handleNextPage,
    handlePrevPage,
    pageSize,
    setPageSize,
    totalPages,
    pages,
    setCurrentPage,
  } = usePaginatedData(filteredUsers);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchInput]);

  const paginatedUsers = paginatedData;

  if (isLoading) return <p>Cargando listado de usuarios</p>;

  return (
    <>
      <SearchInput
        searchInput={searchInput}
        setSearchInput={setSearchInput}
      />
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
            paginatedUsers?.map((user) => (
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
                    getUsers={getUsers}
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
      <Pagination
        currentPage={currentPage}
        handleNextPage={handleNextPage}
        handlePrevPage={handlePrevPage}
        pages={pages}
        setPageSize={setPageSize}
        totalPages={totalPages}
        pageSize={pageSize}
        setCurrentPage={setCurrentPage}
      />
    </>
  );
};

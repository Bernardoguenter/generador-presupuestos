import { useEffect, useState } from "react";
import { Pagination, SearchInput } from "../../../../components";
import type { User } from "../../../../helpers/types";
import { getAllUsers } from "../../../../common/lib";
import { useAuthContext } from "../../../../common/context";
import { usePaginatedData } from "../../../../common/hooks";
import { UseSearchableTable } from "../../../../common/hooks/useSerchableTable";
import { UserTable } from "./UserTable";

export const UserList = () => {
  const [users, setUsers] = useState<User[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { id } = useAuthContext();

  useEffect(() => {
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

    if (id) {
      getUsers(id);
    }
  }, [id]);

  const removeUser = (id: string) => {
    setUsers((prev) => prev?.filter((user) => user.id !== id) || null);
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
  }, [searchInput, setCurrentPage]);

  const paginatedUsers = paginatedData;

  if (isLoading) return <p>Cargando listado de usuarios</p>;

  return (
    <>
      <SearchInput
        searchInput={searchInput}
        setSearchInput={setSearchInput}
      />
      {users && (
        <UserTable
          paginatedUsers={paginatedUsers}
          users={users}
          removeUser={removeUser}
        />
      )}
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

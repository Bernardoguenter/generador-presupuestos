import { Pagination, SearchInput } from "@/components";
import { useUserList } from "../../hooks";
import { UserTable } from "./UserTable";

export const UserList = () => {
  const {
    users,
    paginatedUsers,
    isLoading,
    searchInput,
    setSearchInput,
    currentPage,
    handleNextPage,
    handlePrevPage,
    pageSize,
    setPageSize,
    totalPages,
    pages,
    setCurrentPage,
    removeUser,
  } = useUserList();

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

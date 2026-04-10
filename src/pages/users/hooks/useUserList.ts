import { useEffect, useState } from "react";
import { getAllUsers } from "@/common/lib";
import { useAuthContext } from "@/common/context";
import { usePaginatedData, useDebounce, useSearchableTable } from "@/common/hooks";
import type { User } from "@/types";

export const useUserList = () => {
  const [users, setUsers] = useState<User[] | null>(null);
  const [serverTotalCount, setServerTotalCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { id } = useAuthContext();

  const {
    searchInput,
    setSearchInput,
  } = useSearchableTable<User>({
    data: [],
    filterFn: () => true,
  });

  const {
    currentPage,
    handleNextPage,
    handlePrevPage,
    pageSize,
    setPageSize,
    totalPages,
    pages,
    setCurrentPage,
  } = usePaginatedData(users, 10, serverTotalCount);

  const debouncedSearch = useDebounce(searchInput, 500);

  useEffect(() => {
    const getUsers = async (id: string) => {
      try {
        setIsLoading(true);
        const { data: users, error, count } = await getAllUsers(
          id,
          currentPage,
          pageSize,
          debouncedSearch,
        );
        if (!error && users) {
          setUsers(users);
          setServerTotalCount(count || 0);
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
  }, [id, currentPage, pageSize, debouncedSearch]);

  const removeUser = (id: string) => {
    setUsers((prev) => prev?.filter((user) => user.id !== id) || null);
    setServerTotalCount((prev) => prev - 1);
  };

  const paginatedUsers = users || [];

  return {
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
  };
};

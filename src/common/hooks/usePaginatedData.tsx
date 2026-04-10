import { useMemo } from "react";
import { useSearchParams } from "react-router";

export const usePaginatedData = <T,>(
  data: T[] | null,
  initialPageSize = 10,
  serverTotalCount?: number
) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const urlPage = Number(searchParams.get("page")) || 1;
  const pageSize = Number(searchParams.get("size")) || initialPageSize;

  const totalCount = serverTotalCount !== undefined ? serverTotalCount : (data?.length || 0);
  const totalPages = Math.ceil(totalCount / pageSize) || 1;

  // Ensure page is valid based on total data. E.g if search result only has 1 page, 
  // but url was ?page=5, it bounds it back to 1.
  const validPage = Math.min(Math.max(1, urlPage), totalPages);

  const setCurrentPage = (page: number) => {
    setSearchParams((prev) => {
      prev.set("page", String(page));
      return prev;
    }, { replace: true, viewTransition: true });
  };

  const setPageSize = (size: number) => {
    setSearchParams((prev) => {
      prev.set("size", String(size));
      prev.set("page", "1");
      return prev;
    }, { replace: true, viewTransition: true });
  };

  const paginatedData = useMemo(() => {
    if (!data) return [];
    if (serverTotalCount !== undefined) return data;
    const start = (validPage - 1) * pageSize;
    const end = validPage * pageSize;
    return data.slice(start, end);
  }, [data, validPage, pageSize, serverTotalCount]);

  const pages = useMemo(
    () => Array.from({ length: totalPages }, (_, i) => i + 1),
    [totalPages]
  );

  const handlePrevPage = () => {
    if (validPage > 1) setCurrentPage(validPage - 1);
  };

  const handleNextPage = () => {
    if (validPage < totalPages) setCurrentPage(validPage + 1);
  };

  return {
    currentPage: validPage,
    pageSize,
    totalPages,
    pages,
    paginatedData,
    setPageSize,
    handleNextPage,
    handlePrevPage,
    setCurrentPage,
  };
};

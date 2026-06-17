import { useMemo } from "react";
import { useSearchParams } from "react-router";

const getPositiveNumberParam = (
  searchParams: URLSearchParams,
  key: string,
  fallback: number,
) => {
  const value = Number(searchParams.get(key));

  return Number.isFinite(value) && value > 0 ? value : fallback;
};

export const usePaginatedData = <T,>(
  data: T[] | null,
  initialPageSize = 10,
  serverTotalCount?: number
) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const urlPage = getPositiveNumberParam(searchParams, "page", 1);
  const pageSize = getPositiveNumberParam(
    searchParams,
    "size",
    initialPageSize,
  );

  const totalCount = serverTotalCount !== undefined ? serverTotalCount : (data?.length || 0);
  const totalPages = Math.ceil(totalCount / pageSize) || 1;

  // Ensure page is valid based on total data. E.g if search result only has 1 page, 
  // but url was ?page=5, it bounds it back to 1.
  const validPage = Math.min(Math.max(1, urlPage), totalPages);

  const setCurrentPage = (page: number) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      const nextPage = Number.isFinite(page) && page > 0 ? page : 1;
      next.set("page", String(nextPage));
      return next;
    }, { replace: true, viewTransition: true });
  };

  const setPageSize = (size: number) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      const nextSize =
        Number.isFinite(size) && size > 0 ? size : initialPageSize;
      next.set("size", String(nextSize));
      next.set("page", "1");
      return next;
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

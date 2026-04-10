import { useEffect, useState, useCallback } from "react";
import { getAllCompanies } from "@/common/lib";
import { usePaginatedData, useDebounce, useSearchableTable } from "@/common/hooks";
import type { Company } from "@/types";

export const useCompanyList = () => {
  const [companies, setCompanies] = useState<Company[] | null>(null);
  const [serverTotalCount, setServerTotalCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { searchInput, setSearchInput } = useSearchableTable<Company>({
    data: [],
    filterFn: () => true,
  });

  const debouncedSearch = useDebounce(searchInput, 500);

  const {
    currentPage,
    pageSize,
    handleNextPage,
    handlePrevPage,
    totalPages,
    pages,
    setCurrentPage,
    setPageSize,
  } = usePaginatedData(companies, 10, serverTotalCount);

  const fetchCompanies = useCallback(async () => {
    try {
      setIsLoading(true);
      const { data, error, count } = await getAllCompanies(
        currentPage,
        pageSize,
        debouncedSearch,
      );
      if (!error && data) {
        setCompanies(data);
        setServerTotalCount(count || 0);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, pageSize, debouncedSearch]);

  useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies]);

  const removeCompany = useCallback((id: string) => {
    setCompanies(
      (prev) => prev?.filter((company) => company.id !== id) || null,
    );
    setServerTotalCount((prev) => prev - 1);
  }, []);

  return {
    companies,
    isLoading,
    searchInput,
    setSearchInput,
    pagination: {
      currentPage,
      pageSize,
      handleNextPage,
      handlePrevPage,
      totalPages,
      pages,
      setCurrentPage,
      setPageSize,
    },
    removeCompany,
  };
};

import { useEffect } from "react";
import { Pagination, SearchInput } from "@/components";
import type { Company } from "@/helpers/types";
import { usePaginatedData } from "@/common/hooks";
import { UseSearchableTable } from "@/common/hooks/useSerchableTable";
import { CompanyTable } from "./CompanyTable";
import { useGetAllCompanies } from "@/common/hooks/useGetAllCompanies";

export const CompanyList = () => {
  const { companies, setCompanies, isLoading } = useGetAllCompanies();

  const removeCompany = (id: string) => {
    setCompanies(
      (prev) => prev?.filter((company) => company.id !== id) || null,
    );
  };

  const {
    searchInput,
    setSearchInput,
    filteredData: filteredCompanies,
  } = UseSearchableTable<Company>({
    data: companies || [],
    filterFn: (company, search) =>
      [company.company_name, company.email]
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
  } = usePaginatedData(filteredCompanies);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchInput, setCurrentPage]);

  const paginatedCompanies = paginatedData;

  if (isLoading) return <p>Cargando listado de Empresas</p>;

  return (
    <>
      <SearchInput
        searchInput={searchInput}
        setSearchInput={setSearchInput}
      />
      {companies && (
        <CompanyTable
          paginatedCompanies={paginatedCompanies}
          companies={companies}
          removeCompany={removeCompany}
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

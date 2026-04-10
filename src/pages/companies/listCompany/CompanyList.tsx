import { Pagination, SearchInput } from "@/components";
import { CompanyTable } from "./CompanyTable";
import { useCompanyList } from "../hooks/useCompanyList";

export const CompanyList = () => {
  const {
    companies,
    isLoading,
    searchInput,
    setSearchInput,
    pagination,
    removeCompany,
  } = useCompanyList();

  if (isLoading) return <p className="p-4">Cargando listado de Empresas</p>;

  return (
    <>
      <SearchInput
        searchInput={searchInput}
        setSearchInput={setSearchInput}
      />
      {companies && (
        <CompanyTable
          paginatedCompanies={companies}
          companies={companies}
          removeCompany={removeCompany}
        />
      )}

      <Pagination
        currentPage={pagination.currentPage}
        handleNextPage={pagination.handleNextPage}
        handlePrevPage={pagination.handlePrevPage}
        pages={pagination.pages}
        setPageSize={pagination.setPageSize}
        totalPages={pagination.totalPages}
        pageSize={pagination.pageSize}
        setCurrentPage={pagination.setCurrentPage}
      />
    </>
  );
};

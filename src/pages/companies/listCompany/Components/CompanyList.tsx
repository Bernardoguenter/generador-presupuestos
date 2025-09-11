import { useEffect, useState } from "react";
import { Pagination, SearchInput } from "../../../../components";
import type { Company } from "../../../../helpers/types";
import { getAllCompanies } from "../../../../common/lib";
import { usePaginatedData } from "../../../../common/hooks";
import { UseSearchableTable } from "../../../../common/hooks/useSerchableTable";
import { CompanyTable } from "./CompanyTable";

export const CompanyList = () => {
  const [companies, setCompanies] = useState<Company[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const getCompanies = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await getAllCompanies();
        if (!error) {
          setCompanies(data);
        }
        setIsLoading(false);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    getCompanies();
  }, []);

  const removeCompany = (id: string) => {
    setCompanies(
      (prev) => prev?.filter((company) => company.id !== id) || null
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

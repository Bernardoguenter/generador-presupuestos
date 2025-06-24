import { useEffect, useState } from "react";
import { CustomLink, Pagination, SearchInput } from "../../../../components";
import type { Company } from "../../../../helpers/types";
import { EditIcon } from "../../../../assets/svg";
import { getAllCompanies } from "../../../../common/lib";
import { DeleteCompanyButton } from "./DeleteCompanyButton";
import { usePaginatedData } from "../../../../common/hooks";
import { UseSearchableTable } from "../../../../common/hooks/useSerchableTable";

export const CompanyList = () => {
  const [companies, setCompanies] = useState<Company[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const getCompanies = async () => {
    try {
      const { data, error } = await getAllCompanies();
      if (!error) {
        setCompanies(data);
      }
      setIsLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getCompanies();
  }, [isLoading]);

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
  }, [searchInput]);

  const paginatedCompanies = paginatedData;

  return (
    <>
      <SearchInput
        searchInput={searchInput}
        setSearchInput={setSearchInput}
      />
      <table className="max-w-full shadow-md overflow-hidden border rounded divide-y divide-gray-100">
        <thead className="rounded">
          <tr className="flex items-center w-full ">
            <th className="px-2 py-2 text-left text-sm font-medium w-3/5">
              Nombre Empresa
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {companies?.length === 0 ? (
            <tr>
              <td
                colSpan={3}
                className="text-center py-4">
                No se encontraron empresas
              </td>
            </tr>
          ) : (
            paginatedCompanies?.map((company) => (
              <tr
                key={company.id}
                className="flex items-center w-full ">
                <td className="px-2 py-2 text-xs overflow-hidden w-3/5">
                  {company.company_name}
                </td>
                <td className="px-2 py-2 flex justify-center items-center w-1/5">
                  <DeleteCompanyButton
                    company_name={company.company_name}
                    company_id={company.id}
                    logo_url={company.logo_url}
                    setIsLoading={setIsLoading}
                  />
                </td>
                <td className="px-2 py-2 flex justify-center items-center w-1/5">
                  <CustomLink
                    href={`${company.id}`}
                    styles="flex items-center justify-center">
                    <EditIcon />
                  </CustomLink>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>{" "}
      <Pagination
        currentPage={currentPage}
        handleNextPage={handleNextPage}
        handlePrevPage={handlePrevPage}
        pages={pages}
        setPageSize={setPageSize}
        totalPages={totalPages}
        pageSize={pageSize}
      />
    </>
  );
};

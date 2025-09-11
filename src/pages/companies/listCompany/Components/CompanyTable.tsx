import { EditIcon } from "../../../../assets/svg";
import { CustomLink } from "../../../../components";
import type { Company } from "../../../../helpers/types";
import { DeleteCompanyButton } from "./DeleteCompanyButton";

interface Props {
  paginatedCompanies: Company[];
  companies: Company[];
  removeCompany: (id: string) => void;
}

export const CompanyTable = ({
  paginatedCompanies,
  companies,
  removeCompany,
}: Props) => {
  return (
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
                  removeCompany={removeCompany}
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
    </table>
  );
};

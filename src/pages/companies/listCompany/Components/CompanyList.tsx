import { useEffect, useState } from "react";
import { CustomLink } from "../../../../components";
import type { Company } from "../../../../helpers/types";
import { DeleteIcon, EditIcon } from "../../../../assets/svg";
import { DeleteUserToastError } from "../../../../utils/alerts";
import useSweetAlertModal from "../../../../common/hooks";
import {
  deleteCompany,
  deleteFileInBucket,
  getAllCompanies,
} from "../../../../common/lib";

export const CompanyList = () => {
  const [companies, setCompanies] = useState<Company[] | null>(null);
  const { showAlert } = useSweetAlertModal();

  const getCompanies = async () => {
    try {
      const { data, error } = await getAllCompanies();
      if (error) {
        throw new Error("Error al obtener usuarios");
      }
      setCompanies(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getCompanies();
  }, []);

  const handleDeleteCompany = async (
    id: string,
    company_name: string,
    logo_url: string | null
  ) => {
    try {
      if (id && company_name) {
        const result = await showAlert({
          title: "¿Estás seguro?",
          text: `Esta acción eliminará la empresa ${company_name} y no se puede deshacer`,
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#FF8303",
          cancelButtonColor: "#ff3503",
          confirmButtonText: "Sí, eliminar",
          cancelButtonText: "Cancelar",
        });

        if (result.isConfirmed) {
          const { error } = await deleteCompany(id);

          if (!error) {
            if (logo_url !== null && logo_url !== undefined) {
              const { error: bucketError } = await deleteFileInBucket(
                "companies-logos",
                logo_url
              );
              if (error) {
                console.error(bucketError);
              }
            }
            await showAlert({
              title: "¡Eliminado!",
              text: `La empresa ${company_name} fue eliminado correctamente.`,
              icon: "success",
              confirmButtonColor: "#FF8303",
            });
            const newCompany = companies?.filter(
              (company) => company.id !== id
            );
            if (newCompany) {
              setCompanies(newCompany);
            }
          } else {
            DeleteUserToastError(company_name);
          }
        }
      }
    } catch (error) {
      console.error(error);
      DeleteUserToastError(company_name);
    }
  };

  return (
    <table className="max-w-full shadow-md overflow-hidden border rounded divide-y divide-gray-100">
      <thead className="rounded">
        <tr className="flex items-center w-full ">
          <th className="px-2 py-2 text-left text-sm font-medium w-2/4">
            Nombre Empresa
          </th>
          <th className="px-2 py-2 text-center text-sm font-medium w-1/4">
            Eliminar
          </th>
          <th className="px-2 py-2 text-center text-sm font-medium w-1/4">
            Editar
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
          companies?.map((company) => (
            <tr
              key={company.id}
              className="flex items-center w-full ">
              <td className="px-2 py-2 text-xs overflow-hidden w-2/4">
                {company.company_name}
              </td>
              <td className="px-2 py-2 flex justify-center items-center w-1/4">
                <button
                  onClick={() =>
                    handleDeleteCompany(
                      company.id,
                      company.company_name,
                      company.logo_url
                    )
                  }>
                  <DeleteIcon />
                </button>
              </td>
              <td className="px-2 py-2 flex justify-center items-center w-1/4">
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

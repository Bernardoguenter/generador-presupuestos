import { useEffect, useState } from "react";
import { CustomLink } from "../../../../components/CustomLink";
import type { Company } from "../../../../helpers/types";
import { supabase } from "../../../../utils/supabase";
import { DeleteIcon, EditIcon } from "../../../../assets/svg";
import { DeleteUserToastError } from "../../../../utils/alerts";
import useSweetAlertModal from "../../../../common/hooks";

export const CompanyList = () => {
  const [companies, setCompanies] = useState<Company[] | null>(null);
  const { showAlert } = useSweetAlertModal();

  const getAllCompanies = async () => {
    try {
      const { data, error } = await supabase.from("companies").select("*");
      if (error) {
        throw new Error("Error al obtener usuarios");
      }
      setCompanies(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getAllCompanies();
  }, []);

  const handleDeleteCompany = async (id: string, nombre: string) => {
    try {
      if (id && nombre) {
        const result = await showAlert({
          title: "¿Estás seguro?",
          text: `Esta acción eliminará la empresa ${nombre} y no se puede deshacer`,
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#FF8303",
          cancelButtonColor: "#ff3503",
          confirmButtonText: "Sí, eliminar",
          cancelButtonText: "Cancelar",
        });

        if (result.isConfirmed) {
          const { error } = await supabase
            .from("companies")
            .delete()
            .eq("id", id);

          if (!error) {
            await showAlert({
              title: "¡Eliminado!",
              text: `La empresa ${nombre} fue eliminado correctamente.`,
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
            DeleteUserToastError(nombre);
          }
        }
      }
    } catch (error) {
      console.error(error);
      DeleteUserToastError(nombre);
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
                {company.nombre}
              </td>
              <td className="px-2 py-2 flex justify-center items-center w-1/4">
                <button
                  onClick={() =>
                    handleDeleteCompany(company.id, company.nombre)
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

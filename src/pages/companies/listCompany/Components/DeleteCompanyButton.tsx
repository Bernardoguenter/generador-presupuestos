import { DeleteIcon } from "../../../../assets/svg";
import useSweetAlertModal from "../../../../common/hooks";
import { deleteCompany, deleteFileInBucket } from "../../../../common/lib";
import { DeleteUserToastError } from "../../../../utils/alerts";

type Props = {
  company_name: string;
  company_id: string;
  logo_url: string | null;
  removeCompany: (id: string) => void;
};

export const DeleteCompanyButton = ({
  company_name,
  company_id,
  logo_url,
  removeCompany,
}: Props) => {
  const { showAlert } = useSweetAlertModal();

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
          if (error?.code === "23503") {
            await showAlert({
              title: "No es posible eliminar esta empresa",
              text: `Hay usuarios asinados a la empresa ${company_name}, eliminalos o asignalos a otra empresa antes de eliminar esta empresa`,
              icon: "warning",
              confirmButtonColor: "#FF8303",
            });
          }
          if (!error) {
            removeCompany(id);

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
    <button
      onClick={() => handleDeleteCompany(company_id, company_name, logo_url)}>
      <DeleteIcon />
    </button>
  );
};

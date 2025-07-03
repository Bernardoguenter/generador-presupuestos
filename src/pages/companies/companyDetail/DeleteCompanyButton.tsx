import { useNavigate } from "react-router";
import { Button } from "../../../components";
import { DeleteUserToastError } from "../../../utils/alerts";
import useSweetAlertModal from "../../../common/hooks";
import React from "react";
import { deleteCompany, deleteFileInBucket } from "../../../common/lib";

interface Props {
  setIsSubmitting: React.Dispatch<React.SetStateAction<boolean>>;
  isSubmitting: boolean;
  logo_url: string | null;
  id: string;
  company_name: string;
}

export const DeleteCompanyButton = ({
  setIsSubmitting,
  isSubmitting,
  logo_url,
  id,
  company_name,
}: Props) => {
  const navigate = useNavigate();
  const { showAlert } = useSweetAlertModal();

  const handleDeleteCompany = async (id: string, company_name: string) => {
    try {
      setIsSubmitting(true);
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
            navigate("/companies");
          }
        } else {
          DeleteUserToastError(company_name);
        }
      }
    } catch (error) {
      console.error(error);
      DeleteUserToastError(company_name);
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <Button
      type="button"
      color="danger"
      children="Eliminar empresa"
      styles="mt-4"
      onClick={() => handleDeleteCompany(id, company_name)}
      disabled={isSubmitting}
    />
  );
};

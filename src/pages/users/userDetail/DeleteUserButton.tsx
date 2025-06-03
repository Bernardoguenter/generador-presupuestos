import { useNavigate } from "react-router";
import useSweetAlertModal from "../../../common/hooks";
import { Button } from "../../../components";
import { deleteUser } from "../../../common/lib";
import { DeleteUserToastError } from "../../../utils/alerts";

interface Props {
  isSubmitting: boolean;
  id: string;
  email: string;
}

export const DeleteUserButton = ({ isSubmitting, id, email }: Props) => {
  const navigate = useNavigate();

  const { showAlert } = useSweetAlertModal();

  const handleDeleteUser = async (id: string, email: string) => {
    try {
      if (id && email) {
        const result = await showAlert({
          title: "¿Estás seguro?",
          text: `Esta acción eliminará al usuario ${email} y no se puede deshacer`,
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#FF8303",
          cancelButtonColor: "#ff3503",
          confirmButtonText: "Sí, eliminar",
          cancelButtonText: "Cancelar",
        });

        if (result.isConfirmed) {
          const { error } = await deleteUser(id);

          if (!error) {
            await showAlert({
              title: "¡Eliminado!",
              text: `El usuario ${email} fue eliminado correctamente.`,
              icon: "success",
              confirmButtonColor: "#FF8303",
            });
            navigate("/users");
          } else {
            DeleteUserToastError(email);
          }
        }
      }
    } catch (error) {
      console.error(error);
      DeleteUserToastError(email);
    }
  };
  return (
    <Button
      type="button"
      color="danger"
      children="Eliminar usuario"
      styles="mt-4"
      disabled={isSubmitting}
      onClick={() => handleDeleteUser(id, email)}
    />
  );
};

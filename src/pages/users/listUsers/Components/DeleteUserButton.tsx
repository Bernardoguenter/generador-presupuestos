import { DeleteIcon } from "../../../../assets/svg";
import useSweetAlertModal from "../../../../common/hooks";
import { deleteUser } from "../../../../common/lib";
import { DeleteUserToastError } from "../../../../utils/alerts";

interface Props {
  id: string;
  email: string;
  removeUser: (id: string) => void;
}

export const DeleteUserButton = ({ id, email, removeUser }: Props) => {
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
            removeUser(id);
            await showAlert({
              title: "¡Eliminado!",
              text: `El usuario ${email} fue eliminado correctamente.`,
              icon: "success",
              confirmButtonColor: "#FF8303",
            });
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
    <button onClick={() => handleDeleteUser(id, email)}>
      <DeleteIcon />
    </button>
  );
};

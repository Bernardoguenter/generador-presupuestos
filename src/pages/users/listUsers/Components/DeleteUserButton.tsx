import { DeleteIcon } from "../../../../assets/svg";
import { useAuthContext } from "../../../../common/context";
import useSweetAlertModal from "../../../../common/hooks";
import { deleteUser } from "../../../../common/lib";
import { DeleteUserToastError } from "../../../../utils/alerts";

interface Props {
  id: string;
  email: string;
  getUsers: (id: string) => Promise<void>;
}

export const DeleteUserButton = ({ id, email, getUsers }: Props) => {
  const { showAlert } = useSweetAlertModal();
  const { authUser } = useAuthContext();

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
            if (authUser) {
              getUsers(authUser?.id);
            }
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

import { DeleteIcon } from "../../../../assets/svg";
import useSweetAlertModal from "../../../../common/hooks";
import { deleteBudget } from "../../../../common/lib";
import { DeleteBudgetToastError } from "../../../../utils/alerts";

interface Props {
  id: string;
  removeBudget: (id: string) => void;
  type: "silo" | "structure";
}

export const DeleteBudgetButton = ({ removeBudget, id, type }: Props) => {
  const { showAlert } = useSweetAlertModal();

  const handleDeleteBudget = async (id: string) => {
    try {
      const result = await showAlert({
        title: "¿Estás seguro?",
        text: `Esta acción eliminará el presupuesto y no se puede deshacer`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#FF8303",
        cancelButtonColor: "#ff3503",
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar",
      });

      if (result.isConfirmed) {
        const { error } = await deleteBudget(id, type);

        if (!error) {
          removeBudget(id);
          await showAlert({
            title: "¡Eliminado!",
            text: `El presupuesto fue eliminado correctamente.`,
            icon: "success",
            confirmButtonColor: "#FF8303",
          });
        } else {
          DeleteBudgetToastError();
        }
      }
    } catch (error) {
      console.error(error);
      DeleteBudgetToastError();
    }
  };
  return (
    <button onClick={() => handleDeleteBudget(id)}>
      <DeleteIcon />
    </button>
  );
};

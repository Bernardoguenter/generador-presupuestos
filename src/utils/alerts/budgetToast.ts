import { Toast } from "./toastFactory";

const CreateBudgetToastSuccess = () => {
  Toast.fire({ icon: "success", title: "El presupuesto se ha creado correctamente" });
};

const CreateBudgetToastError = () => {
  Toast.fire({ icon: "error", title: "Ha ocurrido un error al crear el presupuesto" });
};

const UpdateBudgetToastSuccess = () => {
  Toast.fire({ icon: "success", title: "El presupuesto se ha actualizado correctamente" });
};

const UpdateBudgetToastError = () => {
  Toast.fire({ icon: "error", title: "Ha ocurrido un error al actualizar el presupuesto" });
};

const DeleteBudgetToastError = () => {
  Toast.fire({ icon: "error", title: "Ha ocurrido un error al eliminar el presupuesto" });
};

export {
  CreateBudgetToastError,
  CreateBudgetToastSuccess,
  DeleteBudgetToastError,
  UpdateBudgetToastError,
  UpdateBudgetToastSuccess,
};

import { Toast } from "./toastFactory";

const UpdatePreferencesToastSuccess = () => {
  Toast.fire({ icon: "success", title: "Las preferencias se han actualizado exitosamente" });
};

const UpdatePreferencesToastError = () => {
  Toast.fire({ icon: "error", title: "Error al actualizar las preferencias" });
};

const UpdatePricesToastSuccess = () => {
  Toast.fire({ icon: "success", title: "Los precios se han actualizado exitosamente" });
};

const UpdatePricesToastError = () => {
  Toast.fire({ icon: "error", title: "Error al actualizar los precios" });
};

export {
  UpdatePreferencesToastError,
  UpdatePreferencesToastSuccess,
  UpdatePricesToastError,
  UpdatePricesToastSuccess,
};

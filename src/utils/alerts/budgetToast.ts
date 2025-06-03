import Swal from "sweetalert2";

const CreateBudgetToastSuccess = () => {
  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    },
  });
  Toast.fire({
    icon: "success",
    title: `El presupuesto se ha creado correctamente`,
  });
};

const CreateBudgetToastError = () => {
  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    },
  });
  Toast.fire({
    icon: "error",
    title: `Ha ocurrido un error al crear el presupuesto`,
  });
};

const DeleteBudgetToastError = () => {
  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    },
  });
  Toast.fire({
    icon: "error",
    title: `Ha ocurrido un error al eliminar el presupuesto`,
  });
};

export {
  CreateBudgetToastError,
  CreateBudgetToastSuccess,
  DeleteBudgetToastError,
};

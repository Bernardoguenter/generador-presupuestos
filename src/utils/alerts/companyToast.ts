import Swal from "sweetalert2";

const CreateCompanyToastSuccess = (company: string) => {
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
    title: `La empresa ${company} se ha creado exitosamente`,
  });
};

const CreateCompanyToastErrorDuplicated = (company: string) => {
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
    title: `La empresa ${company} ya existe y no es posible crearlo nuevamente`,
  });
};

const CreateCompanyToastError = (error: string) => {
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
    title: `Ha ocurrido el siguiente error: ${error}`,
  });
};

const DeleteCompanyToastSuccess = (company: string) => {
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
    title: `${company} se ha eliminado correctamente`,
  });
};

const DeleteCompanyToastError = (company: string) => {
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
    title: `Ha ocurrido un error al intentar eliminar ${company}`,
  });
};

const UpdateCompanyToastSuccess = (company: string) => {
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
    title: `La empresa ${company} se ha actualizado exitosamente`,
  });
};
const UpdateCompanyToastError = (error: string) => {
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
    title: `Ha ocurrido el siguiente error al actualizar la empresa: ${error}`,
  });
};

export {
  CreateCompanyToastError,
  CreateCompanyToastErrorDuplicated,
  CreateCompanyToastSuccess,
  DeleteCompanyToastError,
  DeleteCompanyToastSuccess,
  UpdateCompanyToastError,
  UpdateCompanyToastSuccess,
};

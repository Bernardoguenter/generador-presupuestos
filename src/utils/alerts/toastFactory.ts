import Swal from "sweetalert2";

/**
 * Shared SweetAlert2 Toast mixin — fuente única de verdad para la configuración de toasts.
 * Todas las funciones de toast en este módulo utilizan este factory.
 */
export const Toast = Swal.mixin({
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

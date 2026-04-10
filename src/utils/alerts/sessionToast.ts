import { Toast } from "./toastFactory";

const LoginSuccessToast = (email: string) => {
  Toast.fire({ icon: "success", title: `Bienvenido ${email}` });
};

const LoginErrorToast = () => {
  Toast.fire({ icon: "error", title: "Error en los datos ingresados" });
};

const LogoutToast = () => {
  Toast.fire({ icon: "error", title: "Se ha cerrado la sesión" });
};

const ChangePasswordToastSuccess = () => {
  Toast.fire({ icon: "success", title: "Se ha cambiado el password. Vuelve a ingresar" });
};

const ChangePasswordToastError = () => {
  Toast.fire({
    icon: "error",
    title: "Ha ocurrido un error al cambiar tu password, vuelve a intentarlo",
  });
};

const ResetPasswordToastSuccess = () => {
  Toast.fire({
    icon: "success",
    title: "Se ha cambiado el password. Recibirás un e-mail con los datos para que puedas ingresar",
  });
};

const ResetPasswordToastError = () => {
  Toast.fire({
    icon: "error",
    title: "Ha ocurrido un error al resetear tu password, vuelve a intentarlo",
  });
};

export {
  LoginErrorToast,
  LoginSuccessToast,
  LogoutToast,
  ChangePasswordToastSuccess,
  ChangePasswordToastError,
  ResetPasswordToastSuccess,
  ResetPasswordToastError,
};

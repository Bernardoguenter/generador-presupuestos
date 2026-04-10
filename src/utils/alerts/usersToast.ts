import { Toast } from "./toastFactory";

const DeleteUserToastSuccess = (user: string) => {
  Toast.fire({ icon: "error", title: `${user} se ha eliminado correctamente` });
};

const DeleteUserToastError = (user: string) => {
  Toast.fire({ icon: "error", title: `Ha ocurrido un error al intentar eliminar ${user}` });
};

const CreateUserToastSuccess = (user: string) => {
  Toast.fire({ icon: "success", title: `El usuario ${user} se ha creado exitosamente` });
};

const CreateUserToastErrorDuplicated = (user: string) => {
  Toast.fire({ icon: "error", title: `El usuario ${user} ya existe y no es posible crearlo nuevamente` });
};

const CreateUserToastError = (error: string) => {
  Toast.fire({ icon: "error", title: `Ha ocurrido el siguiente error: ${error}` });
};

const CreateUserRoleToastError = () => {
  Toast.fire({ icon: "error", title: "Debes seleccionar un rol para tu usuario" });
};

const UpdateUserToastSuccess = (user: string) => {
  Toast.fire({ icon: "success", title: `El usuario ${user} se ha actualizado exitosamente` });
};

const UpdateUserToastError = (error: string) => {
  Toast.fire({ icon: "error", title: `Ha ocurrido el siguiente error: ${error}` });
};

export {
  DeleteUserToastSuccess,
  DeleteUserToastError,
  CreateUserToastSuccess,
  CreateUserToastErrorDuplicated,
  CreateUserToastError,
  CreateUserRoleToastError,
  UpdateUserToastSuccess,
  UpdateUserToastError,
};

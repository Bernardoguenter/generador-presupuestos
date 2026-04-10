import { Toast } from "./toastFactory";

const CreateCompanyToastSuccess = (company: string) => {
  Toast.fire({ icon: "success", title: `La empresa ${company} se ha creado exitosamente` });
};

const CreateCompanyToastErrorDuplicated = (company: string) => {
  Toast.fire({ icon: "error", title: `La empresa ${company} ya existe y no es posible crearlo nuevamente` });
};

const CreateCompanyToastError = (error: string) => {
  Toast.fire({ icon: "error", title: `Ha ocurrido el siguiente error: ${error}` });
};

const DeleteCompanyToastSuccess = (company: string) => {
  Toast.fire({ icon: "error", title: `${company} se ha eliminado correctamente` });
};

const DeleteCompanyToastError = (company: string) => {
  Toast.fire({ icon: "error", title: `Ha ocurrido un error al intentar eliminar ${company}` });
};

const UpdateCompanyToastSuccess = (company: string) => {
  Toast.fire({ icon: "success", title: `La empresa ${company} se ha actualizado exitosamente` });
};

const UpdateCompanyToastError = (error: string) => {
  Toast.fire({ icon: "error", title: `Ha ocurrido el siguiente error al actualizar la empresa: ${error}` });
};

const UpdateCompanyLogoToastSuccess = (company: string) => {
  Toast.fire({ icon: "success", title: `Se ha actualizado el Logo de ${company} exitosamente` });
};

const UpdateCompanyLogoToastError = (company: string) => {
  Toast.fire({ icon: "error", title: `No se ha podido actualizar el Logo de ${company}` });
};

export {
  CreateCompanyToastError,
  CreateCompanyToastErrorDuplicated,
  CreateCompanyToastSuccess,
  DeleteCompanyToastError,
  DeleteCompanyToastSuccess,
  UpdateCompanyToastError,
  UpdateCompanyToastSuccess,
  UpdateCompanyLogoToastSuccess,
  UpdateCompanyLogoToastError,
};

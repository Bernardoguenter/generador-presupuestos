import { CreateCompanyToastError } from "../utils/alerts";

export const showError = (
  error: unknown,
  fallback = "Error al crear la empresa"
) => {
  if (typeof error === "object" && error !== null && "message" in error) {
    CreateCompanyToastError((error as { message: string }).message);
  } else {
    CreateCompanyToastError(fallback);
  }
};

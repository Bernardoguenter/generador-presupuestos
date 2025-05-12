import Swal, {
  type SweetAlertOptions,
  type SweetAlertResult,
} from "sweetalert2";

export const useSweetAlertModal = () => {
  const showAlert = (
    options: SweetAlertOptions
  ): Promise<SweetAlertResult<unknown>> => {
    return Swal.fire(options);
  };

  return { showAlert };
};

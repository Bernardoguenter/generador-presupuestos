import { useFormContext } from "react-hook-form";
import { useAuthContext } from "@/common/context";
import { Button } from "@/components";
import { useUpdateAllCompaniesPreferences } from "../hooks";
import type { Preferences } from "@/types";
import useSweetAlertModal from "@/common/hooks";
import { env } from "@/config/env";

export const UpdateAllUserPreferencesButton = () => {
  const { authUser } = useAuthContext();
  const { getValues } = useFormContext();
  const { updateAll, isSubmitting } = useUpdateAllCompaniesPreferences();
  const { showAlert } = useSweetAlertModal();

  if (
    !authUser ||
    authUser.email !== env.VITE_USER_PREFERENCES_MAIN
  ) {
    return null;
  }

  const handleClick = async () => {
    const {
      company_id: _company_id,
      has_fiber_base: _has_fiber_base,
      ...payload
    } = getValues() as Preferences;

    if (payload) {
      const result = await showAlert({
        title: "¿Estás seguro?",
        text: `Esta acción actualizará las preferencias de todas las empresas`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#FF8303",
        cancelButtonColor: "#ff3503",
        confirmButtonText: "Sí, actualizar",
        cancelButtonText: "Cancelar",
      });

      if (result.isConfirmed) {
        await updateAll(payload);
      }
    }
  };

  return (
    <Button
      type="button"
      color="danger"
      disabled={isSubmitting}
      onClick={handleClick}>
      Actualizar preferencias a todos los usuarios
    </Button>
  );
};

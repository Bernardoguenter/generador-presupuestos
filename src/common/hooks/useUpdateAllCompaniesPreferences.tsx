import type { PreferencesFormData } from "@/pages/main/preferences/schema";
import { useIsSubmitting } from "./useIsSubmitting";
import { usePreferencesContext } from "../context";
import {
  UpdatePreferencesToastError,
  UpdatePreferencesToastSuccess,
} from "@/utils/alerts";
import { supabase } from "@/utils/supabase";

export const useUpdateAllPreferences = () => {
  const { setIsLoading } = usePreferencesContext();
  const { isSubmitting, setIsSubmitting } = useIsSubmitting();

  const updateAll = async (payload: PreferencesFormData) => {
    try {
      setIsSubmitting(true);

      const { error } = await supabase.rpc(
        "update_company_settings_from_json",
        {
          payload,
        },
      );

      if (error) {
        console.error("RPC error:", error);
      } else {
        console.log("Company settings actualizados en todas las filas");
      }

      if (!error) {
        setIsLoading(true);
        UpdatePreferencesToastSuccess();
        return error;
      } else {
        UpdatePreferencesToastError();
      }
    } catch (e) {
      console.error(e);
      UpdatePreferencesToastError();
    } finally {
      setIsSubmitting(false);
    }
  };

  return { updateAll, isSubmitting };
};

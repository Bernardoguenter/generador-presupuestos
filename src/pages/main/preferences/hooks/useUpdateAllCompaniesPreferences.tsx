import type { PreferencesFormData } from "@/pages/main/preferences/schema";

import { usePreferencesContext } from "@common/context";
import {
  UpdatePreferencesToastError,
  UpdatePreferencesToastSuccess,
} from "@/utils/alerts";
import { supabase } from "@/utils/supabase";
import { useIsSubmitting } from "@/common/hooks";

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
        UpdatePreferencesToastError();
        return;
      }

      setIsLoading(true);
      UpdatePreferencesToastSuccess();
    } catch (e) {
      console.error(e);
      UpdatePreferencesToastError();
    } finally {
      setIsSubmitting(false);
    }
  };

  return { updateAll, isSubmitting };
};

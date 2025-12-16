import { useIsSubmitting } from "@/common/hooks/useIsSubmitting";
import { updateUserPreferences, setWebPreferences } from "@/common/lib";
import {
  UpdatePreferencesToastSuccess,
  UpdatePreferencesToastError,
  UpdatePreferencesToastWebSuccess,
  UpdatePreferencesToastWebError,
} from "@/utils/alerts";
import type { PreferencesFormData } from "../schema";
import { usePreferencesContext } from "@/common/context";

export const useUpdatePreferences = () => {
  const { preferences, setIsLoading } = usePreferencesContext();
  const { isSubmitting, setIsSubmitting } = useIsSubmitting();

  const handleSubmit = async (formData: PreferencesFormData) => {
    const company_id = preferences.company_id;
    try {
      setIsSubmitting(true);
      const { error } = await updateUserPreferences(formData, company_id);
      if (!error) {
        setIsLoading(true);
        UpdatePreferencesToastSuccess();
      } else {
        UpdatePreferencesToastError();
      }

      if (import.meta.env.VITE_PREFERENCES_ID === company_id) {
        const { error } = await setWebPreferences(formData, company_id);
        if (!error) {
          UpdatePreferencesToastWebSuccess();
        } else {
          UpdatePreferencesToastWebError();
        }
      }
    } catch (error) {
      console.error(error);
      UpdatePreferencesToastError();
    } finally {
      setIsSubmitting(false);
    }
  };

  return { isSubmitting, handleSubmit };
};

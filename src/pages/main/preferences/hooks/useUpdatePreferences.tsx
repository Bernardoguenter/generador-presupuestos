import { useIsSubmitting } from "@/common/hooks";
import { useMemo } from "react";
import { updateUserPreferences } from "@/common/lib";
import {
  UpdatePreferencesToastSuccess,
  UpdatePreferencesToastError,
} from "@/utils/alerts";
import type { PreferencesFormData } from "../schema";
import { usePreferencesContext } from "@/common/context";

export const useUpdatePreferences = () => {
  const { preferences, setPreferences, setIsLoading } = usePreferencesContext();
  const { isSubmitting, setIsSubmitting } = useIsSubmitting();

  const handleSubmit = async (formData: PreferencesFormData) => {
    const company_id = preferences.company_id;
    try {
      setIsSubmitting(true);
      const { data, error } = await updateUserPreferences(formData, company_id);

      if (!error && data) {
        setPreferences(data[0]);
        setIsLoading(true);
        UpdatePreferencesToastSuccess();
      } else {
        UpdatePreferencesToastError();
      }
    } catch (error) {
      console.error(error);
      UpdatePreferencesToastError();
    } finally {
      setIsSubmitting(false);
    }
  };

  const defaultValues = useMemo(() => {
    if (!preferences) return undefined;

    return {
      ...preferences,
    };
  }, [preferences]);

  return { isSubmitting, handleSubmit, defaultValues };
};

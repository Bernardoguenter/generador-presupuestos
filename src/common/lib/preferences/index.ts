import type { Preferences } from "@/types";
import { supabase } from "@/utils/supabase";

const PREFERENCES_TABLE = "company_settings" as const;

type PreferencesUpdate = Partial<Omit<Preferences, "company_id">>;

const getUserPreferences = async (id: string) => {
  const { data, error } = await supabase
    .from(PREFERENCES_TABLE)
    .select("*")
    .eq("company_id", id)
    .single();

  return { data, error };
};

const updateUserPreferences = async (
  dataToUpdate: PreferencesUpdate,
  id: string
) => {
  const { data, error } = await supabase
    .from(PREFERENCES_TABLE)
    .update(dataToUpdate)
    .eq("company_id", id)
    .select();

  return { data, error };
};

export { getUserPreferences, updateUserPreferences };


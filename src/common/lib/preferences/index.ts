import type { Preferences } from "../../../helpers/types";
import { supabase } from "../../../utils/supabase";

type PreferencesUpdate = Partial<Omit<Preferences, "company_id">>;

const getUserPreferences = async (id: string) => {
  const { data, error } = await supabase
    .from("company_settings")
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
    .from("company_settings")
    .update(dataToUpdate)
    .eq("company_id", id)
    .select();

  return { data, error };
};

export { getUserPreferences, updateUserPreferences };

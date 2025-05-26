import { useEffect, useState, type ReactNode } from "react";
import type { Preferences } from "../../../helpers/types";
import { PreferencesContext } from "./PreferencesContext";
import { getUserPreferences } from "../../lib";
import { useAuthContext } from "../AuthContext/AuthContext";

const initialPreferencies = {
  company_id: "",
  dollar_quote: 0,
  default_markup: 0,
  wharehouse_prices: {},
  shed_prices: {},
  gate_price: 0,
  km_price: 0,
  colored_sheet_difference: 0,
  u_profile_difference: 0,
  solid_web_difference: 0,
};

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);
  const [preferences, setPreferences] =
    useState<Preferences>(initialPreferencies);
  const { authUser } = useAuthContext();

  const getPreferences = async (id: string) => {
    try {
      const { data, error } = await getUserPreferences(id);

      if (!error) {
        setPreferences(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (authUser) {
      getPreferences(authUser?.company_id);
    }
  }, [isLoading, authUser]);

  return (
    <PreferencesContext.Provider
      value={{
        isLoading,
        setIsLoading,
        preferences,
        setPreferences,
      }}>
      {children}
    </PreferencesContext.Provider>
  );
}

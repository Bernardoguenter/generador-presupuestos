import { createContext, useContext } from "react";
import type { Preferences } from "../../../helpers/types";

interface PreferencesContextInterface {
  preferences: Preferences;
  setPreferences: React.Dispatch<React.SetStateAction<Preferences>>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export const PreferencesContext = createContext<
  PreferencesContextInterface | undefined
>(undefined);

export function usePreferencesContext() {
  const context = useContext(PreferencesContext);
  if (!context) {
    throw new Error(
      "usePreferencesContext must be used within an AuthProvider"
    );
  }
  return context;
}

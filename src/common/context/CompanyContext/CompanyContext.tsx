import { createContext, use } from "react";
import type { Company } from "../../../helpers/types";

interface CompanyContextInterface {
  company: Company | null;
  setCompany: React.Dispatch<React.SetStateAction<Company | null>>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export const CompanyContext = createContext<
  CompanyContextInterface | undefined
>(undefined);

export function useCompanyContext() {
  const context = use(CompanyContext);
  if (!context) {
    throw new Error(
      "usePreferencesContext must be used within an AuthProvider"
    );
  }
  return context;
}

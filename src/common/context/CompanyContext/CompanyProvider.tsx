import { useEffect, useState, type ReactNode } from "react";
import type { Company } from "../../../helpers/types";
import { CompanyContext } from "./CompanyContext";
import { useAuthContext } from "../AuthContext/AuthContext";
import { getCompanyById } from "../../lib";

export function CompanyProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);
  const [company, setCompany] = useState<Company | null>(null);
  const { authUser } = useAuthContext();

  const getCompany = async (id: string) => {
    try {
      const { data, error } = await getCompanyById(id);
      if (!error) {
        setCompany(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (authUser) {
      getCompany(authUser.company_id);
    }
  }, [isLoading, authUser]);

  return (
    <CompanyContext.Provider
      value={{
        isLoading,
        setIsLoading,
        company,
        setCompany,
      }}>
      {children}
    </CompanyContext.Provider>
  );
}

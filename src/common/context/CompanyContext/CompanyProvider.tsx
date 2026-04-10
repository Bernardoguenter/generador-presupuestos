import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Company } from "@/types";
import { CompanyContext } from "./CompanyContext";
import { getCompanyById } from "@common/lib";
import { useAuthContext } from "../AuthContext/AuthContext";

export function CompanyProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);
  const [company, setCompany] = useState<Company | null>(null);
  const { authUser } = useAuthContext();

  const getCompany = useCallback(async (id: string) => {
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
  }, []);

  useEffect(() => {
    if (authUser?.company_id) {
      getCompany(authUser.company_id);
    }
  }, [authUser?.company_id, getCompany]);

  const values = useMemo(
    () => ({
      isLoading,
      setIsLoading,
      company,
      setCompany,
    }),
    [isLoading, company],
  );

  return (
    <CompanyContext.Provider value={values}>{children}</CompanyContext.Provider>
  );
}


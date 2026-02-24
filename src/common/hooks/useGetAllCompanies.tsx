import type { Company } from "@/helpers/types";
import { getAllCompanies } from "../lib";
import { useEffect, useState } from "react";

export const useGetAllCompanies = () => {
  const [companies, setCompanies] = useState<Company[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const getCompanies = async () => {
      const { data, error } = await getAllCompanies();
      if (!error) {
        setCompanies(data);
      }
    };
    getCompanies();
  }, []);

  return { companies, setCompanies, isLoading, setIsLoading };
};

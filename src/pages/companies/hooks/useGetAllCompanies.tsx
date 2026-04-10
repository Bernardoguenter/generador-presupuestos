import { getAllCompanies } from "@/common/lib";
import type { Company } from "@/types";
import { useEffect, useState } from "react";

export const useGetAllCompanies = (
  page?: number,
  pageSize?: number,
  search?: string,
) => {
  const [companies, setCompanies] = useState<Company[] | null>(null);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const getCompanies = async () => {
      setIsLoading(true);
      const { data, error, count } = await getAllCompanies(
        page,
        pageSize,
        search,
      );
      if (!error && data) {
        setCompanies(data);
        setTotalCount(count || 0);
      }
      setIsLoading(false);
    };
    getCompanies();
  }, [page, pageSize, search]);

  return { companies, setCompanies, totalCount, isLoading, setIsLoading };
};

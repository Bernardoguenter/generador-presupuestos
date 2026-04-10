import { useEffect, useState } from "react";
import { getCompanyById } from "@/common/lib";
import type { Company } from "@/types";

interface Props {
  id: string;
}

export const useGetCompany = ({ id }: Props) => {
  const [company, setCompany] = useState<Company | null>(null);

  useEffect(() => {
    const getCompany = async (id: string) => {
      try {
        const { data, error } = await getCompanyById(id);
        if (!error) {
          setCompany(data);
        }
      } catch (error) {
        console.error(error);
      }
    };
    getCompany(id);
  }, [id]);

  return company;
};

import { useEffect, useState } from "react";
import { useParams } from "react-router";
import type { Company } from "../../../helpers/types";
import { getCompanyById } from "../../../common/lib";
import { CompanyDetailHeader } from "./CompanyDetailHeader";
import CompanyDetailForm from "./CompanyDetailForm";

export default function CompanyDetail() {
  const { id } = useParams();
  const [company, setCompany] = useState<Company | null>(null);

  useEffect(() => {
    if (id) {
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
    }
  }, [id]);

  if (!company) return <h2>No se encontró información para esta empresa</h2>;

  return (
    <section className="w-full flex flex-col lg:flex-row lg:gap-8">
      <CompanyDetailHeader company={company} />
      <CompanyDetailForm company={company} />
    </section>
  );
}

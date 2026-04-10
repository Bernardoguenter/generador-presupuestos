import { useParams } from "react-router";
import { CompanyDetailHeader } from "./CompanyDetailHeader";
import CompanyDetailForm from "./CompanyDetailForm";
import { useGetCompany } from "../hooks";

export default function CompanyDetail() {
  const { id } = useParams();
  const company = useGetCompany({ id: id ?? "0" });

  if (!company) return <h2>No se encontró información para esta empresa</h2>;

  return (
    <section className="w-full flex flex-col lg:flex-row lg:gap-8">
      <CompanyDetailHeader company={company} />
      <CompanyDetailForm company={company} />
    </section>
  );
}

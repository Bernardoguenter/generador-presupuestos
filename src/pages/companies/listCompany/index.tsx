import { CustomLink } from "../../../components/CustomLink";
import { CompanyList } from "./Components/CompanyList";

export default function ListCompany() {
  return (
    <section className="py-4 flex flex-col gap-4 w-full">
      <div className="flex items-center justify-between">
        <h2>Lisado de Empresas</h2>
        <CustomLink
          href="create-company"
          color="danger"
          styles="self-end">
          Crear Empresa
        </CustomLink>
      </div>
      <CompanyList />
    </section>
  );
}

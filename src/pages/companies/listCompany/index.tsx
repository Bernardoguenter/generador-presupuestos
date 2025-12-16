import { CompanyList } from "./CompanyList";
import { CustomLink, SearchInput } from "@/components";
import { useState } from "react";
import { useDebounce } from "@/common/hooks";

export default function ListCompany() {
  const [searchInput, setSearchInput] = useState<string>("");
  const debouncedSearch = useDebounce(searchInput, 300);
  return (
    <section className="py-4 flex flex-col gap-4 w-full">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-medium">Listado de Empresas</h2>
        <CustomLink
          href="create-company"
          color="danger"
          styles="self-end">
          Crear Empresa
        </CustomLink>
      </div>
      <SearchInput
        searchInput={searchInput}
        setSearchInput={setSearchInput}
      />
      <CompanyList
        debouncedSearch={debouncedSearch}
        searchInput={searchInput}
      />
    </section>
  );
}

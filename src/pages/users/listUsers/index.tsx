import { useState } from "react";
import { useDebounce } from "../../../common/hooks";
import { CustomLink, SearchInput } from "../../../components";
import { UserList } from "./Components/UserList";

export default function ListUsers() {
  const [searchInput, setSearchInput] = useState<string>("");
  const debouncedSearch = useDebounce(searchInput, 300);

  return (
    <section className="py-4 flex flex-col gap-4 w-full">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-medium">Listado de Usuarios</h2>
        <CustomLink
          href="create-user"
          color="danger"
          styles="self-end">
          Crear Usuario
        </CustomLink>
      </div>
      <SearchInput
        searchInput={searchInput}
        setSearchInput={setSearchInput}
      />
      <UserList
        debouncedSearch={debouncedSearch}
        searchInput={searchInput}
      />
    </section>
  );
}

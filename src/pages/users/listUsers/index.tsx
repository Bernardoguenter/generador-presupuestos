import { CustomLink } from "../../../components/CustomLink";
import { UserList } from "./Components/UserList";

export default function ListUsers() {
  return (
    <section className="py-4 flex flex-col gap-4 w-full">
      <div className="flex items-center justify-between">
        <h2>Lisado de Usuarios</h2>
        <CustomLink
          href="create-user"
          color="danger"
          styles="self-end">
          Crear Usuario
        </CustomLink>
      </div>
      <UserList />
    </section>
  );
}

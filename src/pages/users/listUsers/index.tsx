import { CustomLink } from "../../../components/CustomLink";

export default function ListUsers() {
  return (
    <section className="py-4 flex flex-col w-full self">
      <CustomLink
        href="create-user"
        color="danger"
        styles="self-end">
        Crear Usuario
      </CustomLink>
      <h2>Lisado de Usuarios</h2>
    </section>
  );
}

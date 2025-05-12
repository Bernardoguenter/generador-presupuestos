import { Link, NavLink } from "react-router";
import { Button } from "../components/Button";
import { useAuthContext } from "../common/context/AuthContext/AuthContext";

export const Navbar = () => {
  const { authUser, handleLogout } = useAuthContext();

  return (
    <header className="w-full h-16 border-b flex items-center justify-between p-4">
      <h1>
        <Link to={"/"}>LOGO</Link>
      </h1>
      <nav className="flex flex-end gap-4 items-center">
        {authUser?.role === "superadmin" && (
          <NavLink
            to={"/users"}
            className={({ isActive }) =>
              isActive ? "text-gray-400 underline" : ""
            }>
            Usuarios
          </NavLink>
        )}
        <NavLink
          to={"/budgets"}
          className={({ isActive }) =>
            isActive ? "text-gray-400 underline" : ""
          }>
          Presupuestos
        </NavLink>
        <Button
          onClick={handleLogout}
          color="info">
          Salir
        </Button>
      </nav>
    </header>
  );
};

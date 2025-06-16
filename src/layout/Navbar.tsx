import { Link, NavLink } from "react-router";
import {
  BudgetIcon,
  CompanyIcon,
  LogoutIcon,
  PreferencesIcon,
} from "../assets/svg";
import { UserIcon } from "../assets/svg/UserIcon";
import { Button } from "../components";
import { useAuthContext } from "../common/context";
import { Logo } from "../components/Logo";

export const Navbar = () => {
  const { authUser, handleLogout } = useAuthContext();

  return (
    <header className="w-full h-16 border-b flex items-center justify-between p-4">
      <Link to={"/"}>
        <Logo
          containerStyles="h-14 flex items-center"
          logoStyles="object-cover h-10"
        />
      </Link>

      <nav className="flex flex-end gap-4 lg:gap-8 items-center">
        {authUser?.role === "superadmin" && (
          <>
            <NavLink
              to={"/users"}
              className={({ isActive }) =>
                `flex gap-0.5 items-center ${
                  isActive ? "text-gray-400 underline" : ""
                }`
              }>
              <UserIcon />
              <span className="hidden lg:block">Usuarios</span>
            </NavLink>
            <NavLink
              to={"/companies"}
              className={({ isActive }) =>
                `flex gap-0.5 items-center ${
                  isActive ? "text-gray-400 underline" : ""
                }`
              }>
              <CompanyIcon />
              <span className="hidden lg:block">Empresas</span>
            </NavLink>
          </>
        )}
        <NavLink
          to={"/budgets"}
          className={({ isActive }) =>
            `flex gap-0.5 items-center ${
              isActive ? "text-gray-400 underline" : ""
            }`
          }>
          <BudgetIcon />
          <span className="hidden lg:block">Presupuestos</span>
        </NavLink>
        {authUser?.role !== "usuario" && (
          <NavLink
            to={"/preferences"}
            className={({ isActive }) =>
              `flex gap-0.5 items-center ${
                isActive ? "text-gray-400 underline" : ""
              }`
            }>
            <PreferencesIcon />
            <span className="hidden lg:block">Preferencias</span>
          </NavLink>
        )}
        <Button
          onClick={handleLogout}
          color="info"
          styles="min-w-fit flex items-center">
          <LogoutIcon />
          <span className="hidden lg:block">Salir</span>
        </Button>
      </nav>
    </header>
  );
};

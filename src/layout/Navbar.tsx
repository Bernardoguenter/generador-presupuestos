import { Link, NavLink } from "react-router";
import {
  BudgetIcon,
  CompanyIcon,
  LogoutIcon,
  PreferencesIcon,
} from "../assets/svg";
import { UserIcon } from "../assets/svg/UserIcon";
import { useEffect, useState } from "react";
import { retriveFileFromBucket } from "../common/lib";
import { Button } from "../components";
import { useAuthContext, useCompanyContext } from "../common/context";

export const Navbar = () => {
  const { authUser, handleLogout } = useAuthContext();
  const { company } = useCompanyContext();
  const [logoUrl, setLogoUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchLogo = async () => {
      if (company && company.logo_url) {
        const { data } = await retriveFileFromBucket(
          "companies-logos",
          company.logo_url
        );
        if (data) setLogoUrl(data.publicUrl);
      }
    };
    fetchLogo();
  }, [company]);

  return (
    <header className="w-full h-16 border-b flex items-center justify-between p-4">
      <Link to={"/"}>
        {logoUrl ? (
          <div className="h-14 flex items-center">
            <img
              className="object-cover h-10 "
              src={logoUrl}
              alt={company ? company.company_name : "Logo"}
            />
          </div>
        ) : (
          <h1>{company?.company_name}</h1>
        )}
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

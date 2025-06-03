import { Routes, Route, Navigate } from "react-router";
import { lazy } from "react";

// Layouts
import AppLayout from "../layout/AppLayout";
import DefaultLayout from "../layout/DefaultLayout";
import { useAuthContext } from "../common/context";

// Páginas públicas (account)
const Login = lazy(() => import("../pages/account/Login"));
const ResetPasswrord = lazy(() => import("../pages/account/ResetPassword"));

// Páginas privadas
const MainComponent = lazy(() => import("../pages/main/mainComponent"));
const Preferences = lazy(() => import("../pages/main/preferences"));

const ChangePassword = lazy(() => import("../pages/account/ChangePassword"));
const Calculator = lazy(() => import("../pages/budgets/calculator"));
const BudgetHistory = lazy(() => import("../pages/budgets/history"));
const BudgetDetail = lazy(() => import("../pages/budgets/budgetDetail"));

const CreateUser = lazy(() => import("../pages/users/createUsers"));
const ListUsers = lazy(() => import("../pages/users/listUsers"));
const UserDetail = lazy(() => import("../pages/users/userDetail"));

const CreateCompany = lazy(() => import("../pages/companies/createCompany"));
const ListCompany = lazy(() => import("../pages/companies/listCompany"));
const CompanyDetail = lazy(() => import("../pages/companies/companyDetail"));

export default function AppRoutes() {
  const { authUser } = useAuthContext();

  return (
    <Routes>
      {/* Rutas públicas */}
      <Route
        path="/account"
        element={
          !authUser ? (
            <DefaultLayout />
          ) : (
            <Navigate
              to="/"
              replace
            />
          )
        }>
        <Route
          path="login"
          element={<Login />}
        />
        <Route
          path="reset-password"
          element={<ResetPasswrord />}
        />
      </Route>
      {authUser && (
        <Route
          path="account/"
          element={<DefaultLayout />}>
          <Route
            path="change-password"
            element={<ChangePassword />}
          />
        </Route>
      )}

      {/* Rutas privadas */}
      {authUser && (
        <Route
          path="/"
          element={<AppLayout />}>
          <Route
            index
            element={<MainComponent />}
          />

          {/* Presupuestos */}
          <Route path="budgets/*">
            <Route
              path="calculator"
              element={<Calculator />}
            />
            <Route
              index
              element={<BudgetHistory />}
            />
            <Route
              path=":id"
              element={<BudgetDetail />}
            />
          </Route>

          {/* Usuarios */}
          {authUser.role === "superadmin" && (
            <Route path="users/*">
              <Route
                path="create-user"
                element={<CreateUser />}
              />
              <Route
                index
                element={<ListUsers />}
              />
              <Route
                path=":id"
                element={<UserDetail />}
              />
            </Route>
          )}
          {authUser.role !== "usuario" && (
            <Route path="/*">
              <Route
                path="preferences"
                element={<Preferences />}
              />
            </Route>
          )}

          {authUser.role === "superadmin" && (
            <Route path="companies/*">
              <Route
                path="create-company"
                element={<CreateCompany />}
              />
              <Route
                index
                element={<ListCompany />}
              />
              <Route
                path=":id"
                element={<CompanyDetail />}
              />
            </Route>
          )}

          {/* Redirección en caso de ruta no encontrada */}
          <Route
            path="*"
            element={
              <Navigate
                to="/"
                replace
              />
            }
          />
        </Route>
      )}

      {/* Si no está autenticado y quiere ir a cualquier otra ruta, redirige a login */}
      {!authUser && (
        <Route
          path="*"
          element={
            <Navigate
              to="/account/login"
              replace
            />
          }
        />
      )}
    </Routes>
  );
}

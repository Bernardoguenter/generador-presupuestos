import { Routes, Route, Navigate } from "react-router";
import { lazy } from "react";
import { useAuthContext } from "../common/context/AuthContext/AuthContext";

// Layouts
import AppLayout from "../layout/AppLayout";
import DefaultLayout from "../layout/DefaultLayout";

// Páginas públicas (account)
const Login = lazy(() => import("../pages/account/Login"));
const ChangePassword = lazy(() => import("../pages/account/ChangePassword"));

// Páginas privadas
const MainComponent = lazy(() => import("../pages/main/mainComponent"));
const Calculator = lazy(() => import("../pages/budgets/calculator"));
const BudgetHistory = lazy(() => import("../pages/budgets/history"));

const CreateUser = lazy(() => import("../pages/users/createUsers"));
const Preferences = lazy(() => import("../pages/users/preferences"));
const ListUsers = lazy(() => import("../pages/users/listUsers"));

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
          </Route>

          {/* Usuarios */}
          {authUser.role === "superadmin" && (
            <Route path="users/*">
              <Route
                path="create-user"
                element={<CreateUser />}
              />
              <Route
                path="preferences"
                element={<Preferences />}
              />
              <Route
                index
                element={<ListUsers />}
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

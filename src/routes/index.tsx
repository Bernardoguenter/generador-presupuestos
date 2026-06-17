import { Routes, Route, Navigate, Outlet, useLocation } from "react-router";
import { lazy, type ReactNode } from "react";

// Layouts
import { AppLayout, DefaultLayout } from "../layout";
import { useAuthContext } from "../common/context";
import { useFavicon } from "../common/hooks";
import { PageLoader } from "../components";

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

const BudgetsHistoryList = lazy(() =>
  import("../pages/budgets/history/BudgetsHistoryList").then((m) => ({
    default: m.BudgetsHistoryList,
  })),
);
const SiloBudgetsHistoryList = lazy(() =>
  import("../pages/budgets/history/SiloBudgetsHistoryList").then((m) => ({
    default: m.SiloBudgetsHistoryList,
  })),
);

const FullPageLoader = () => (
  <div className="min-h-screen bg-gray-900 flex justify-center items-center">
    <PageLoader />
  </div>
);

const RequireAuth = ({
  allowPasswordChange = false,
}: {
  allowPasswordChange?: boolean;
}) => {
  const { authUser, loading } = useAuthContext();
  const location = useLocation();

  if (loading) return <FullPageLoader />;

  if (!authUser) {
    return (
      <Navigate
        to="/account/login"
        replace
        state={{ from: `${location.pathname}${location.search}` }}
      />
    );
  }

  if (
    !allowPasswordChange &&
    authUser.isPasswordChanged === false &&
    location.pathname !== "/account/change-password"
  ) {
    return (
      <Navigate
        to="/account/change-password"
        replace
      />
    );
  }

  return <Outlet />;
};

const PublicOnlyRoute = ({ children }: { children: ReactNode }) => {
  const { authUser, loading } = useAuthContext();
  const location = useLocation();
  const state = location.state as { from?: string } | null;
  const redirectTo =
    state?.from && !state.from.startsWith("/account/") ? state.from : "/";

  if (loading) return <FullPageLoader />;

  return authUser ? (
    <Navigate
      to={redirectTo}
      replace
    />
  ) : (
    children
  );
};

const RequireRole = ({
  allowed,
  children,
}: {
  allowed: (role: string) => boolean;
  children: ReactNode;
}) => {
  const { authUser } = useAuthContext();

  return authUser && allowed(authUser.role) ? (
    children
  ) : (
    <Navigate
      to="/"
      replace
    />
  );
};

export default function AppRoutes() {
  useFavicon();

  return (
    <Routes>
      {/* Rutas públicas */}
      <Route
        path="/account"
        element={<DefaultLayout />}>
        <Route
          path="login"
          element={
            <PublicOnlyRoute>
              <Login />
            </PublicOnlyRoute>
          }
        />
        <Route
          path="reset-password"
          element={
            <PublicOnlyRoute>
              <ResetPasswrord />
            </PublicOnlyRoute>
          }
        />
      </Route>

      <Route
        path="account/"
        element={<DefaultLayout />}>
        <Route element={<RequireAuth allowPasswordChange />}>
          <Route
            path="change-password"
            element={<ChangePassword />}
          />
        </Route>
      </Route>

      {/* Rutas privadas */}
      <Route element={<RequireAuth />}>
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

            <Route element={<BudgetHistory />}>
              <Route
                path="structures"
                element={<BudgetsHistoryList />}
              />
              <Route
                path="silos"
                element={<SiloBudgetsHistoryList />}
              />
              <Route
                index
                element={
                  <Navigate
                    to="structures"
                    replace
                  />
                }
              />
            </Route>

            <Route
              path="structures/:id"
              element={<BudgetDetail />}
            />
            <Route
              path="silos/:id"
              element={<BudgetDetail />}
            />
          </Route>

          {/* Usuarios */}
          <Route path="users/*">
            <Route
              path="create-user"
              element={
                <RequireRole allowed={(role) => role === "superadmin"}>
                  <CreateUser />
                </RequireRole>
              }
            />
            <Route
              index
              element={
                <RequireRole allowed={(role) => role === "superadmin"}>
                  <ListUsers />
                </RequireRole>
              }
            />
            <Route
              path=":id"
              element={
                <RequireRole allowed={(role) => role === "superadmin"}>
                  <UserDetail />
                </RequireRole>
              }
            />
          </Route>

          <Route
            path="preferences"
            element={
              <RequireRole allowed={(role) => role !== "usuario"}>
                <Preferences />
              </RequireRole>
            }
          />

          <Route path="companies/*">
            <Route
              path="create-company"
              element={
                <RequireRole allowed={(role) => role === "superadmin"}>
                  <CreateCompany />
                </RequireRole>
              }
            />
            <Route
              index
              element={
                <RequireRole allowed={(role) => role === "superadmin"}>
                  <ListCompany />
                </RequireRole>
              }
            />
            <Route
              path=":id"
              element={
                <RequireRole allowed={(role) => role === "superadmin"}>
                  <CompanyDetail />
                </RequireRole>
              }
            />
          </Route>

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
      </Route>

      <Route
        path="*"
        element={
          <Navigate
            to="/"
            replace
          />
        }
      />
    </Routes>
  );
}

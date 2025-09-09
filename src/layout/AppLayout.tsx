import { Suspense } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { BackButton, PageLoader } from "../components";
import { useAuthContext } from "../common/context";

const AppLayout = () => {
  const { authUser } = useAuthContext();
  /*   const navigate = useNavigate(); */
  const location = useLocation();

  if (
    !authUser?.isPasswordChanged &&
    location.pathname !== "/account/change-password"
  ) {
    return (
      <Navigate
        to="/account/change-password"
        replace
      />
    );
  }

  return (
    <main className="flex flex-col w-full min-h-screen bg-gray-900 text-white">
      <Suspense fallback={<PageLoader />}>
        <Navbar />
      </Suspense>
      <section className="grow-1 p-4">
        <Suspense fallback={<PageLoader />}>
          <aside className="flex justify-between items-center">
            <BackButton />
          </aside>
          <Outlet />
        </Suspense>
      </section>

      <Suspense fallback={<PageLoader />}>
        <Footer />
      </Suspense>
    </main>
  );
};
export default AppLayout;

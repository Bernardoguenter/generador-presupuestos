import { Suspense, useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { useAuthContext } from "../common/context/AuthContext/AuthContext";
import { BackButton, PageLoader } from "../components";

const AppLayout = () => {
  const { authUser } = useAuthContext();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (
      !authUser?.isPasswordChanged &&
      location.pathname !== "/account/change-password"
    ) {
      navigate("/account/change-password", { replace: true });
    }
  }, [authUser]);

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

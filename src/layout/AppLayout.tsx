import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import PageLoader from "../components/PageLoader";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import BackButton from "../components/BackButton";

const AppLayout = () => {
  return (
    <main className="flex flex-col w-full min-h-screen bg-gray-900 text-white">
      <Suspense fallback={<PageLoader />}>
        <Navbar />
      </Suspense>
      <section className="grow-1 p-4">
        <Suspense fallback={<PageLoader />}>
          <aside>
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

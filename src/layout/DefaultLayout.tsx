import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import PageLoader from "../components/PageLoader";

const DefaultLayout = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <main className="flex justify-start items-center h-screen w-full gap-2 flex-col bg-gray-900 text-white p-4 py-16">
        <div className="h-1/5 flex items-center">
          <h1 className="text-5xl text-center ">Generador de Presupuestos</h1>
        </div>
        <div className="w-full h-4/5 flex flex-col items-center justify-center">
          <Outlet />
        </div>
      </main>
    </Suspense>
  );
};
export default DefaultLayout;

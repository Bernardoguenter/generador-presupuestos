import { lazy } from "react";

const MainComponent = lazy(() => import("./mainComponent"));

export default function Home() {
  return <MainComponent />;
}

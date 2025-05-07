import { lazy } from "react";

const Login = lazy(() => import("./Login"));

export default function Account() {
  return <Login />;
}

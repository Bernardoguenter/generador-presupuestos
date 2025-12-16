import { useAuthContext } from "@/common/context";
import Calculator from "@/pages/budgets/calculator";

export default function Main() {
  const { authUser } = useAuthContext();
  return (
    <>
      <h1 className="text-3xl text-right">¡Hola {authUser?.fullName}!</h1>
      <Calculator />
    </>
  );
}

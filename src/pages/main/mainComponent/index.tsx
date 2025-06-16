import { BudgetCalculatorForm } from "../../budgets/calculator/components/BudgetCalculatorForm";
import { useAuthContext } from "../../../common/context";

export default function Main() {
  const { authUser } = useAuthContext();
  return (
    <>
      <h1 className="text-3xl text-right">¡Hola {authUser?.fullName}!</h1>
      <BudgetCalculatorForm />
    </>
  );
}

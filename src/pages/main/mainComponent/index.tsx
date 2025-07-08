import { useAuthContext } from "../../../common/context";
import { BudgetCalculatorForm } from "../../budgets/calculator/BudgetCalculatorForm";

export default function Main() {
  const { authUser } = useAuthContext();
  return (
    <>
      <h1 className="text-3xl text-right">¡Hola {authUser?.fullName}!</h1>
      <BudgetCalculatorForm />
    </>
  );
}

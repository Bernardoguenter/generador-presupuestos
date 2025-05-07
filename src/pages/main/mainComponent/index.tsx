import { Link } from "react-router-dom";

export default function Main() {
  return (
    <>
      <Link to="/budgets/calculator">Calcular Presupuesto</Link>
      <Link to="/budgets"> Ver Historial de Presupuestos</Link>
    </>
  );
}

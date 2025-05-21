import { Link } from "react-router-dom";

export default function Main() {
  return (
    <>
      <h1 className="text-3xl">CALCULADORA DE PRESUPUESTOS</h1>
      <Link to="/budgets/calculator">Calcular Presupuesto</Link>
      <Link to="/budgets"> Ver Historial de Presupuestos</Link>
    </>
  );
}

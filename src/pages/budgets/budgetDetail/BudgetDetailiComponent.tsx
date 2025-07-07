import { usePreferencesContext } from "../../../common/context";
import { StringToList } from "../../../components/StringToList";
import { formatDate, formatNumber } from "../../../helpers/formatData";
import type { Budget } from "../../../helpers/types";

interface Props {
  budget: Budget;
}

export const BudgetDetailComponent = ({ budget }: Props) => {
  const { preferences } = usePreferencesContext();

  return (
    <div className="py-4 flex flex-col gap-4 w-full lg:w-1/2">
      <h2>
        <strong>Presupuesto para </strong>
        {budget.customer}
      </h2>
      <ul className="flex flex-col gap-4 w-full">
        <li>
          <strong>Creado por: </strong>
          {typeof budget.created_by === "object" && budget.created_by !== null
            ? budget.created_by.fullName
            : budget.created_by}
        </li>
        <li>
          <strong>Fecha de creación: </strong>
          {formatDate(budget.created_at)}
        </li>
        <li>
          <strong>Dirección: </strong>
          {(budget.address && budget.address.address) || ""}
        </li>
        <li>
          <strong>Tipo de estructura: </strong>
          {budget.structure_type}
        </li>
        <li>
          <strong>Material: </strong>
          {budget.material}
        </li>
        <li>
          <strong>Medidas de la estrucutura: </strong>
          {budget.width} de ancho x {budget.height} de alto x {budget.length}{" "}
          {budget.structure_type === "Galpón" &&
            `con cerramiento de ${budget.enclousure_height}`}
        </li>
        <li>
          <strong>Detalles: </strong>
          <StringToList
            inputString={budget.details}
            textSize="text-md"
          />
        </li>
        <li>
          <strong>¿Incluye portón? </strong>
          {budget.includes_gate ? "Si" : "No"}
        </li>
        {budget.includes_gate && (
          <li>
            <strong>Cantidad de portones: </strong>
            {budget.number_of_gates}
          </li>
        )}
        {budget.includes_gate && budget.gates_measurements !== null && (
          <li>
            <ul>
              <strong>Medidas de Portones: </strong>
              {budget.gates_measurements.map((gate) => (
                <li
                  className="list-disc list-inside"
                  key={gate.height}>
                  Alto: {gate.height}, Ancho: {gate.width}
                </li>
              ))}
            </ul>
          </li>
        )}
        <li>
          <strong>¿Incluye canaletas? </strong>
          {budget.has_gutter ? "Si" : "No"}
        </li>
        {budget.includes_gate && (
          <li>
            <strong>Metros de canaletas: </strong>
            {budget.gutter_metters}{" "}
          </li>
        )}
        <li>
          <strong>¿Incluye IVA?</strong> {budget.includes_taxes ? "Si" : "No"}
        </li>
        <li>
          <strong>¿Incluye Flete? </strong>
          {budget.includes_freight ? "Si" : "No"}
        </li>
        {budget.includes_freight && (
          <li>
            <strong>Costo de Flete: </strong>
            USD{formatNumber(budget.freight_price)}
          </li>
        )}
        <li>
          <strong>¿Incluye Chapa de techo color?</strong>{" "}
          {budget.color_roof_sheet ? "Si" : "No"}
        </li>
        <li>
          <strong>¿Incluye Chapa lateral color? </strong>
          {budget.color_side_sheet ? "Si" : "No"}
        </li>
        <li>
          <strong>IMPORTE TOTAL: </strong> USD{formatNumber(budget.total)}
        </li>
        <li>
          <strong>IMPORTE TOTAL EN PESOS: </strong> $
          {formatNumber(
            budget.total *
              (1 + budget.budget_markup / 100) *
              preferences.dollar_quote
          )}
        </li>
      </ul>
    </div>
  );
};

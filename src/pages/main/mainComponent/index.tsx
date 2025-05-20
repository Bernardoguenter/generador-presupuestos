import { Link } from "react-router-dom";
import { usePreferencesContext } from "../../../common/context/PreferencesContext/PreferencesContext";
import { useAuthContext } from "../../../common/context/AuthContext/AuthContext";
import { useCompanyContext } from "../../../common/context/CompanyContext/CompanyContext";

export default function Main() {
  const { preferences } = usePreferencesContext();
  const { authUser } = useAuthContext();
  const { company } = useCompanyContext();

  return (
    <>
      <Link to="/budgets/calculator">Calcular Presupuesto</Link>
      <Link to="/budgets"> Ver Historial de Presupuestos</Link>
      <br />
      <br />
      <br />
      <br />
      <p>
        <strong>Company Id en Preferences: </strong>
        {preferences.company_id}
      </p>
      <br />
      <br />{" "}
      <p>
        {" "}
        <strong>Company Id en AuthUser: </strong>
        {authUser?.company_id}
      </p>
      <br />
      <br />
      <p>
        {" "}
        <strong>Company Data: </strong>
        {company?.nombre}
      </p>
    </>
  );
}

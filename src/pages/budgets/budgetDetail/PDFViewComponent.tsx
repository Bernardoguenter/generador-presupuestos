import { Logo } from "../../../components";
import {
  useAuthContext,
  useCompanyContext,
  usePreferencesContext,
} from "../../../common/context";
import type { Budget } from "../../../helpers/types";
import { formatNumber } from "../../../helpers/formatData";
import { StringToList } from "../../../components/StringToList";

interface Props {
  budget: Budget;
}

export const PDFViewComponent = ({ budget }: Props) => {
  const { company } = useCompanyContext();
  const { preferences } = usePreferencesContext();
  const { authUser } = useAuthContext();

  return (
    <div
      id="pdf"
      style={{
        backgroundColor: "#ffffff",
        color: "#000000",
        boxSizing: "border-box",
      }}
      className="overflow-hidden p-4 lg:p-8 lg:w-1/2 w-full max-w-[20cm] max-h-max">
      <div className="flex justify-between items-start mb-8">
        <Logo
          containerStyles="t"
          logoStyles="pdf-logo max-w-[120px] aspect-square object-contain"
        />
        <aside className="text-right text-xs leading-3.5">
          <p className="font-bold">{company?.company_name}</p>
          <p>{company?.address.address}</p>
          <p>Tel: {company?.phone}</p>
          <p>{company?.email}</p>
        </aside>
      </div>
      <div className="m-2.5 mb-8 text-xs leading-4">
        <p className="font-bold">Estimado {budget?.customer}:</p>
        <p>
          Le agradecemos su consulta y hacemos la siguiente oferta según nuestra
          comunicación previa.
        </p>
      </div>
      <div className="m-2.5">
        <table className="w-full border-collapse my-5 mx-0 text-xs text-left border table-fixed">
          <thead style={{ backgroundColor: "#e5e7eb" }}>
            <tr className="h-10 text-center text-xs">
              <th className=" w-3-4">Descripción</th>
              <th className=" w-1/4">Importe Total</th>
            </tr>
          </thead>
          <tbody className="h-20">
            <tr className="border">
              <td className="text-xs p-3 w-3/4 ">{budget.description}</td>
              <td className="text-center border w-1/4 ">
                {budget.total
                  ? "$" +
                    formatNumber(
                      Math.round(
                        (budget.total * preferences.dollar_quote) / 1000000
                      ) * 1000000
                    )
                  : ""}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="text-xs w-max mt-2 leading-3.5 m-2.5">
        <StringToList
          inputString={budget.caption}
          textSize="text-xs"
        />
      </div>
      <div className="m-2.5 text-left text-base ">
        <h2 className=" mb-1 font-bold">Detalle de materiales:</h2>
        <StringToList
          inputString={budget.details}
          textSize="text-xs"
        />
      </div>
      <div className="m-2.5 text-left text-base ">
        <h2 className=" mb-1 font-bold">Formas de pago:</h2>
        <StringToList
          inputString={budget.paymentMethods}
          textSize="text-xs"
        />
      </div>
      <div className="m-2.5 mt-8 text-left text-xs ">
        <p>Esperamos con interés trabajar con usted.</p>
        <p>Le saluda atentamente:</p>
        <p className="mt-4">
          {authUser?.fullName} - <span>{company?.company_name}</span>
        </p>
      </div>
    </div>
  );
};

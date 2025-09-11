import { Logo } from "../../../components";
import {
  useAuthContext,
  useCompanyContext,
  usePreferencesContext,
} from "../../../common/context";
import type { StructureBudget } from "../../../helpers/types";
import { formatNumber } from "../../../helpers/formatData";
import { StringToList } from "../../../components/StringToList";

interface Props {
  budget: StructureBudget;
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
      className="overflow-hidden p-4 lg:p-8 lg:w-1/2 w-full max-h-max max-w-[20cm]">
      <div className="flex justify-between items-start mb-8">
        <Logo
          containerStyles="t"
          logoStyles="pdf-logo max-w-[120px] aspect-square object-contain"
        />
        <aside className="text-right leading-3.5">
          <p className="font-bold">{company?.company_name}</p>
          <p>
            {company?.hasPdfAddress
              ? company.pdfAddress
              : company?.address.address}
          </p>
          <p>Tel: {company?.phone}</p>
          <p>{company?.email}</p>
        </aside>
      </div>
      <div className="m-2.5 mb-8  leading-4">
        <p className="font-bold">Estimado {budget?.customer}:</p>
        <p>
          Le agradecemos su consulta y hacemos la siguiente oferta según nuestra
          comunicación previa.
        </p>
      </div>
      <div className="m-2.5">
        <table className="w-full border-collapse my-5 mx-0  text-left border table-fixed">
          <thead style={{ backgroundColor: "#e5e7eb" }}>
            <tr className="h-10 text-center ">
              <th className=" w-3-4">Descripción</th>
              <th className=" w-1/4">Importe Total</th>
            </tr>
          </thead>
          <tbody className="h-20">
            <tr className="border">
              <td className=" p-3 w-3/4 ">{budget.description}</td>
              <td className="text-center border w-1/4 ">
                {budget.total
                  ? "$" +
                    formatNumber(
                      Math.floor(
                        (budget.total *
                          (1 + budget.budget_markup / 100) *
                          preferences.dollar_quote) /
                          1000
                      ) * 1000
                    )
                  : ""}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className=" w-max mt-2 leading-3.5 m-2.5">
        {budget.caption === "" || !budget.caption ? (
          ""
        ) : (
          <StringToList
            inputString={budget.caption}
            textSize="text-base"
          />
        )}
      </div>
      <div className="m-2.5 text-left text-base ">
        <h2 className=" mb-1 font-bold">Detalle de materiales:</h2>
        <StringToList inputString={budget.details} />
      </div>
      <div className="m-2.5 text-left text-base ">
        <h2 className=" mb-1 font-bold">Formas de pago:</h2>
        <StringToList inputString={budget.paymentMethods} />
      </div>
      <div className="m-2.5 mt-8 text-left  ">
        <p>Esperamos con interés trabajar con usted.</p>
        <p>Le saluda atentamente:</p>
        <p className="mt-4">
          {authUser?.fullName} - <span>{company?.company_name}</span>
        </p>
      </div>
    </div>
  );
};

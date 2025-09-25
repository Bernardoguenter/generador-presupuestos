import { usePreferencesContext } from "../../../common/context";
import { formatNumber } from "../../../helpers/formatData";
import type { StructureBudget } from "../../../helpers/types";

interface Props {
  budget: StructureBudget;
}

export const BudgetStructureTable = ({ budget }: Props) => {
  const { preferences } = usePreferencesContext();
  return (
    <>
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
    </>
  );
};

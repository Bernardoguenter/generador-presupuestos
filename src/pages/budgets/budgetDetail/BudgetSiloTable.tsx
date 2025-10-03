import { usePreferencesContext } from "../../../common/context";
import { formatNumber } from "../../../helpers/formatData";
import type { SiloBudget } from "../../../helpers/types";

interface Props {
  budget: SiloBudget;
}

export const BudgetSiloTable = ({ budget }: Props) => {
  const { preferences } = usePreferencesContext();

  const budgetsToRender = budget.description.split(";");
  const pricesToRender = [...budget.totals.silos];

  if (
    budget.totals.extra_product_price &&
    budget.totals.extra_product_price > 0
  ) {
    pricesToRender.push(budget.totals.extra_product_price);
  }

  return (
    <div className="m-2.5">
      <table className="w-full border-collapse my-5 mx-0  text-left border table-fixed">
        <thead style={{ backgroundColor: "#e5e7eb" }}>
          <tr className="h-10 text-center ">
            <th className=" w-3-4">Descripción</th>
            <th className=" w-1/4">Importe</th>
          </tr>
        </thead>
        <tbody className="h-20">
          {budgetsToRender.map((desc) => (
            <tr className="border">
              <>
                <td
                  className=" p-3 w-3/4 "
                  key={desc}>
                  {desc}
                </td>
                <td className="text-center border w-1/4">
                  {"$" +
                    formatNumber(
                      Math.floor(
                        ((((pricesToRender[budgetsToRender.indexOf(desc)] ??
                          0) *
                          (budget as SiloBudget).budget_markup) /
                          100 +
                          (pricesToRender[budgetsToRender.indexOf(desc)] ??
                            0)) *
                          preferences.dollar_quote) /
                          1000
                      ) * 1000
                    )}
                </td>
              </>
            </tr>
          ))}
          {budget.includes_freight && (
            <tr className="border">
              <td className=" p-3 w-3/4 ">Flete</td>
              <td className="text-center border w-1/4 ">
                {"$" +
                  formatNumber(
                    Math.floor(
                      ((budget as SiloBudget).totals.freight_price *
                        (1 + budget.budget_markup / 100) *
                        preferences.dollar_quote) /
                        1000
                    ) * 1000
                  )}
              </td>
            </tr>
          )}
          <tr className="border">
            <td className=" p-3 w-3/4 ">Total</td>
            <td className="text-center border w-1/4 ">
              {"$" +
                formatNumber(
                  Math.floor(
                    ((budget as SiloBudget).totals.total *
                      (1 + budget.budget_markup / 100) *
                      preferences.dollar_quote) /
                      1000
                  ) * 1000
                )}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

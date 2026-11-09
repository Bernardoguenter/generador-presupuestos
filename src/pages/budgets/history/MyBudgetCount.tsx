import { useMemo } from "react";
import { BudgetPeriodFilter } from "@/components";
import { useAuthContext } from "@/common/context";
import { useBudgetCounts } from "@/common/hooks";
import { getBudgetPeriodLabel } from "@/helpers/budgetPeriods";

/** "Hiciste 12 presupuestos en los últimos 7 días", arriba del listado. */
export const MyBudgetCount = () => {
  const { id } = useAuthContext();
  const ids = useMemo(() => (id ? [id] : []), [id]);
  const { period, day, counts, isLoading, onChange } = useBudgetCounts(ids);
  const mine = id ? counts[id] : undefined;
  const total = mine?.total ?? 0;

  return (
    <div className="flex flex-col gap-2 border rounded p-3">
      <p className="text-sm">
        {isLoading ? (
          "Contando tus presupuestos..."
        ) : (
          <>
            Hiciste <b className="text-lg">{total}</b>{" "}
            {total === 1 ? "presupuesto" : "presupuestos"}{" "}
            {getBudgetPeriodLabel(period, day)}
            {mine && mine.silos > 0
              ? ` (${mine.structures} galpones/tinglados y ${mine.silos} silos)`
              : ""}
            .
          </>
        )}
      </p>
      <BudgetPeriodFilter
        period={period}
        day={day}
        onChange={onChange}
      />
    </div>
  );
};

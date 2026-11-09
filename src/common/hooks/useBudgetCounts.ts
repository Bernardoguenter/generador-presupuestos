import { useEffect, useMemo, useState } from "react";
import { getBudgetCountsByUser, type BudgetCounts } from "@/common/lib/stats";
import {
  getBudgetPeriodRange,
  toDateInputValue,
  type BudgetPeriod,
} from "@/helpers/budgetPeriods";

/** Cuenta los presupuestos de cada usuario en el período elegido. */
export const useBudgetCounts = (
  userIds: string[],
  initialPeriod: BudgetPeriod = "7d",
) => {
  const [period, setPeriod] = useState<BudgetPeriod>(initialPeriod);
  const [day, setDay] = useState<string>(toDateInputValue());
  const [counts, setCounts] = useState<BudgetCounts>({});
  const [isLoading, setIsLoading] = useState(false);
  const key = userIds.join(",");

  const range = useMemo(() => getBudgetPeriodRange(period, day), [period, day]);

  useEffect(() => {
    const ids = key ? key.split(",") : [];
    if (!ids.length) {
      setCounts({});
      return;
    }
    let active = true;
    setIsLoading(true);
    getBudgetCountsByUser(ids, range.from, range.to).then(({ data }) => {
      if (!active) return;
      setCounts(data);
      setIsLoading(false);
    });
    return () => {
      active = false;
    };
  }, [key, range]);

  const onChange = (p: BudgetPeriod, d: string) => {
    setPeriod(p);
    setDay(d || toDateInputValue());
  };

  return { period, day, counts, isLoading, onChange };
};

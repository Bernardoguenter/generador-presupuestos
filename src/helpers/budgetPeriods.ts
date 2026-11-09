/** Períodos para contar presupuestos: últimos 7 días, últimos 30 días o un día. */
export type BudgetPeriod = "7d" | "30d" | "day";

const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());

/** Devuelve el rango [from, to) del período, en la hora local. */
export const getBudgetPeriodRange = (
  period: BudgetPeriod,
  day?: string,
  now: Date = new Date(),
) => {
  const tomorrow = startOfDay(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  if (period === "day") {
    const [y, m, d] = (day ?? "").split("-").map(Number);
    const from = y && m && d ? new Date(y, m - 1, d) : startOfDay(now);
    const to = new Date(from);
    to.setDate(to.getDate() + 1);
    return { from, to };
  }
  const days = period === "7d" ? 7 : 30;
  const from = new Date(tomorrow);
  from.setDate(from.getDate() - days);
  return { from, to: tomorrow };
};

/** "2026-11-09" de una fecha local (para el input de fecha). */
export const toDateInputValue = (d: Date = new Date()) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

export const getBudgetPeriodLabel = (period: BudgetPeriod, day?: string) => {
  if (period === "7d") return "en los últimos 7 días";
  if (period === "30d") return "en los últimos 30 días";
  const [y, m, d] = (day ?? "").split("-");
  return y ? `el ${d}/${m}/${y}` : "hoy";
};

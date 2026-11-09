import type { BudgetPeriod } from "@/helpers/budgetPeriods";

interface Props {
  period: BudgetPeriod;
  day: string;
  onChange: (period: BudgetPeriod, day: string) => void;
}

const options: { value: BudgetPeriod; label: string }[] = [
  { value: "7d", label: "Últimos 7 días" },
  { value: "30d", label: "Últimos 30 días" },
  { value: "day", label: "Un día" },
];

/** Botones para elegir el período en que se cuentan los presupuestos. */
export const BudgetPeriodFilter = ({ period, day, onChange }: Props) => (
  <div className="flex flex-wrap items-center gap-2">
    {options.map((o) => (
      <button
        key={o.value}
        type="button"
        onClick={() => onChange(o.value, day)}
        className={`px-3 py-1 rounded border text-sm font-medium cursor-pointer ${
          period === o.value
            ? "bg-[#FF8303] border-[#FF8303] text-white"
            : "border-gray-400"
        }`}>
        {o.label}
      </button>
    ))}
    {period === "day" && (
      <input
        type="date"
        aria-label="Fecha"
        value={day}
        onChange={(e) => onChange("day", e.target.value)}
        className="px-2 py-1 rounded border border-gray-400 text-sm bg-transparent"
      />
    )}
  </div>
);

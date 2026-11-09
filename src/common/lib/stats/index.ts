import { supabase } from "@/utils/supabase";

/**
 * Numeración y conteo de presupuestos, sin columnas nuevas en la base:
 * se calcula contando los presupuestos (galpones/tinglados + silos) de los
 * usuarios de la empresa.
 */

/** Desde cuándo se numeran los presupuestos (el N° 1 es el primero desde acá). */
export const BUDGET_NUMBER_START = "2026-11-09T10:05:00-03:00";

const TABLES = ["budgets_structures", "budgets_silo"] as const;

const getCompanyUserIds = async (companyId: string) => {
  const { data, error } = await supabase
    .from("users")
    .select("id")
    .eq("company_id", companyId);
  if (error || !data) return null;
  return data.map((u: { id: string }) => u.id);
};

/**
 * Número del presupuesto: cuántos presupuestos de la empresa hay desde
 * BUDGET_NUMBER_START hasta `createdAt` (incluido). Sin `createdAt` devuelve
 * el número que le tocaría a uno nuevo. Devuelve null si el presupuesto es
 * anterior a la numeración o si no se pudo calcular.
 */
export const getBudgetNumber = async (
  companyId: string | undefined | null,
  createdAt?: string | null,
): Promise<number | null> => {
  try {
    if (!companyId) return null;
    if (createdAt && new Date(createdAt) < new Date(BUDGET_NUMBER_START))
      return null;
    const ids = await getCompanyUserIds(companyId);
    if (!ids?.length) return null;
    const counts = await Promise.all(
      TABLES.map(async (table) => {
        let query = supabase
          .from(table)
          .select("id", { count: "exact", head: true })
          .in("created_by", ids)
          .gte("created_at", new Date(BUDGET_NUMBER_START).toISOString());
        if (createdAt) query = query.lte("created_at", createdAt);
        const { count, error } = await query;
        if (error) throw error;
        return count ?? 0;
      }),
    );
    const total = counts[0] + counts[1];
    return createdAt ? Math.max(total, 1) : total + 1;
  } catch (error) {
    console.error("No se pudo calcular el número de presupuesto", error);
    return null;
  }
};

export type BudgetCounts = Record<
  string,
  { structures: number; silos: number; total: number }
>;

/** Cuántos presupuestos hizo cada usuario entre `from` (incluido) y `to` (excluido). */
export const getBudgetCountsByUser = async (
  userIds: string[],
  from: Date,
  to: Date,
): Promise<{ data: BudgetCounts; error: unknown }> => {
  const data: BudgetCounts = {};
  userIds.forEach((id) => (data[id] = { structures: 0, silos: 0, total: 0 }));
  if (!userIds.length) return { data, error: null };
  try {
    const [structures, silos] = await Promise.all(
      TABLES.map(async (table) => {
        const { data: rows, error } = await supabase
          .from(table)
          .select("created_by")
          .in("created_by", userIds)
          .gte("created_at", from.toISOString())
          .lt("created_at", to.toISOString())
          .range(0, 9999);
        if (error) throw error;
        return (rows ?? []) as { created_by: string }[];
      }),
    );
    structures.forEach(({ created_by }) => {
      if (!data[created_by]) return;
      data[created_by].structures++;
      data[created_by].total++;
    });
    silos.forEach(({ created_by }) => {
      if (!data[created_by]) return;
      data[created_by].silos++;
      data[created_by].total++;
    });
    return { data, error: null };
  } catch (error) {
    console.error("No se pudieron contar los presupuestos", error);
    return { data, error };
  }
};

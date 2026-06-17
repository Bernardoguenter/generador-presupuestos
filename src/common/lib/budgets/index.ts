import type { SiloBudget, StructureBudget } from "@/types";
import { supabase } from "@/utils/supabase";

const BUDGET_TABLES = {
  structure: "budgets_structures",
  silo: "budgets_silo",
} as const;

type BudgetType = keyof typeof BUDGET_TABLES;

const getBudgetTable = (type: BudgetType) => BUDGET_TABLES[type];

const normalizeSearchTerm = (search?: string) => {
  const normalized = search
    ?.trim()
    .replace(/[(),]/g, " ")
    .replace(/\s+/g, " ");

  return normalized || undefined;
};

const getSearchFilter = (search: string, includeAddress = true) => {
  const filters = [`customer.ilike.%${search}%`];

  if (includeAddress) {
    filters.push(`address->>address.ilike.%${search}%`);
  }

  return filters.join(",");
};

const buildBudgetsQuery = (
  id: string,
  type: BudgetType,
  page?: number,
  pageSize?: number,
  search?: string,
  includeAddressSearch = true,
) => {
  let query = supabase
    .from(getBudgetTable(type))
    .select("*", { count: "exact" })
    .eq("created_by", id)
    .order("created_at", { ascending: false });

  if (search) {
    query = query.or(getSearchFilter(search, includeAddressSearch));
  }

  if (page && pageSize && page > 0 && pageSize > 0) {
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    query = query.range(from, to);
  }

  return query;
};

const createBudget = async (
  dataToSubmit: Omit<StructureBudget | SiloBudget, "created_at" | "id">,
  type: BudgetType = "structure",
) => {
  const { data, error } = await supabase
    .from(getBudgetTable(type))
    .insert([dataToSubmit])
    .select()
    .single();

  return { data, error };
};

const updateBudget = async (
  dataToSubmit: Omit<StructureBudget | SiloBudget, "created_at" | "id">,
  id: string,
  type: BudgetType = "structure",
) => {
  const { data, error } = await supabase
    .from(getBudgetTable(type))
    .update([dataToSubmit])
    .eq("id", id)
    .select()
    .single();

  return { data, error };
};

const getAllBudgets = async (
  id: string,
  type: BudgetType = "structure",
  page?: number,
  pageSize?: number,
  search?: string,
) => {
  const normalizedSearch = normalizeSearchTerm(search);
  const query = buildBudgetsQuery(
    id,
    type,
    page,
    pageSize,
    normalizedSearch,
  );

  const { data, error, count } = await query;

  if (error && normalizedSearch) {
    console.warn(
      "No se pudo buscar presupuestos por dirección; se reintenta por campos de texto.",
      error.message,
    );

    return await buildBudgetsQuery(
      id,
      type,
      page,
      pageSize,
      normalizedSearch,
      false,
    );
  }

  return { data, count, error };
};

const deleteBudget = async (
  id: string,
  type: BudgetType = "structure",
) => {
  const { error } = await supabase
    .from(getBudgetTable(type))
    .delete()
    .eq("id", id);

  return { error };
};

const getBudgetById = async (
  id: string,
  type: BudgetType = "structure",
) => {
  const { data, error } = await supabase
    .from(getBudgetTable(type))
    .select(
      `
    *,
    created_by (
      id, fullName
    )
  `,
    )
    .eq("id", id)
    .single();

  return { data, error };
};

export {
  createBudget,
  getAllBudgets,
  deleteBudget,
  getBudgetById,
  updateBudget,
};


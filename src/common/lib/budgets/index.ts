import type { SiloBudget, StructureBudget } from "@/types";
import { supabase } from "@/utils/supabase";

const BUDGET_TABLES = {
  structure: "budgets_structures",
  silo: "budgets_silo",
} as const;

type BudgetType = keyof typeof BUDGET_TABLES;

const getBudgetTable = (type: BudgetType) => BUDGET_TABLES[type];

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
  let query = supabase
    .from(getBudgetTable(type))
    .select("*", { count: "exact" })
    .eq("created_by", id)
    .order("created_at", { ascending: false });

  if (search) {
    const searchFilter =
      type === "structure"
        ? `customer.ilike.%${search}%,structure_type.ilike.%${search}%,address->>address.ilike.%${search}%`
        : `customer.ilike.%${search}%,address->>address.ilike.%${search}%`;

    query = query.or(searchFilter);
  }

  if (page && pageSize && page > 0 && pageSize > 0) {
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    query = query.range(from, to);
  }

  const { data, error, count } = await query;

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


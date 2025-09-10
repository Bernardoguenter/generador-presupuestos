import type { Budget } from "../../../helpers/types";
import { supabase } from "../../../utils/supabase";

const createBudget = async (
  dataToSubmit: Omit<Budget, "created_at" | "id">
) => {
  const { data, error } = await supabase
    .from("budgets_structures")
    .insert([dataToSubmit])
    .select()
    .single();

  return { data, error };
};

const updateBudget = async (
  dataToSubmit: Omit<Budget, "created_at" | "id">,
  id: string
) => {
  const { data, error } = await supabase
    .from("budgets_structures")
    .update(dataToSubmit)
    .eq("id", id)
    .select();

  return { data, error };
};

const getAllBudgets = async (id: string) => {
  const { data, error, count } = await supabase
    .from("budgets_structures")
    .select("*", { count: "exact" })
    .eq("created_by", id);

  return { data, count, error };
};

const deleteBudget = async (id: string) => {
  const { error } = await supabase.from("budgets").delete().eq("id", id);

  return { error };
};

const getBudgetById = async (id: string) => {
  const { data, error } = await supabase
    .from("budgets_structures")
    .select(
      `
    *,
    created_by (
      id, fullName
    )
  `
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

import type { SiloBudget, StructureBudget } from "../../../helpers/types";
import { supabase } from "../../../utils/supabase";

const createBudget = async (
  dataToSubmit: Omit<StructureBudget | SiloBudget, "created_at" | "id">,
  type: "silo" | "structure" = "structure"
) => {
  const { data, error } = await supabase
    .from(type === "structure" ? "budgets_structures" : "budgets_silo")
    .insert([dataToSubmit])
    .select()
    .single();

  return { data, error };
};

const updateBudget = async (
  dataToSubmit: Omit<StructureBudget | SiloBudget, "created_at" | "id">,
  id: string,
  type: "silo" | "structure" = "structure"
) => {
  const { data, error } = await supabase
    .from(type === "structure" ? "budgets_structures" : "budgets_silo")
    .update([dataToSubmit])
    .eq("id", id)
    .select()
    .single();

  return { data, error };
};

const getAllBudgets = async (
  id: string,
  type: "silo" | "structure" = "structure"
) => {
  const { data, error, count } = await supabase
    .from(type === "structure" ? "budgets_structures" : "budgets_silo")
    .select("*", { count: "exact" })
    .eq("created_by", id);

  return { data, count, error };
};

const deleteBudget = async (
  id: string,
  type: "silo" | "structure" = "structure"
) => {
  const { error } = await supabase
    .from(type === "structure" ? "budgets_structures" : "budgets_silo")
    .delete()
    .eq("id", id);

  return { error };
};

const getBudgetById = async (
  id: string,
  type: "silo" | "structure" = "structure"
) => {
  const { data, error } = await supabase
    .from(type === "structure" ? "budgets_structures" : "budgets_silo")
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

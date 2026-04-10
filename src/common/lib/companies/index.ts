import type { Company } from "@/types";
import { supabase } from "@/utils/supabase";

const COMPANIES_TABLE = "companies" as const;

const getAllCompanies = async (
  page?: number,
  pageSize?: number,
  search?: string,
) => {
  let query = supabase
    .from(COMPANIES_TABLE)
    .select("*", { count: "exact" })
    .order("company_name", { ascending: true });

  if (search) {
    query = query.ilike("company_name", `%${search}%`);
  }

  if (page && pageSize && page > 0 && pageSize > 0) {
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    query = query.range(from, to);
  }

  const { data, error, count } = await query;

  return { data, count, error };
};

const getCompanyById = async (id: string) => {
  const { data, error } = await supabase
    .from(COMPANIES_TABLE)
    .select("*")
    .eq("id", id)
    .single();

  return { data, error };
};

const createCompany = async (
  createCompanyBody: Omit<Company, "id" | "logo_url" | "created_at">,
) => {
  const { data, error } = await supabase
    .from(COMPANIES_TABLE)
    .insert([createCompanyBody])
    .select()
    .single();

  return { data, error };
};

const updateCompany = async (
  dataToUpdate: Partial<Omit<Company, "id" | "created_at">>,
  id: string,
) => {
  const { data, error } = await supabase
    .from(COMPANIES_TABLE)
    .update(dataToUpdate)
    .eq("id", id)
    .select()
    .single();

  return { data, error };
};

const deleteCompany = async (id: string) => {
  const { error } = await supabase
    .from(COMPANIES_TABLE)
    .delete()
    .eq("id", id);

  return { error };
};

export {
  getAllCompanies,
  createCompany,
  updateCompany,
  deleteCompany,
  getCompanyById,
};


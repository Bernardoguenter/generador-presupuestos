import type { Company } from "../../../helpers/types";
import { supabase } from "../../../utils/supabase";

type CreateCompanyFormData = {
  email: string;
  nombre: string;
  telefono: string;
  direccion: string;
};

const getAllCompanies = async () => {
  const { data, error } = await supabase.from("companies").select("*");
  return { data, error };
};

const getCompanyById = async (id: string) => {
  const { data, error } = await supabase
    .from("companies")
    .select("*")
    .eq("id", id)
    .single();

  return { data, error };
};

const createCompany = async (createCompanyBody: CreateCompanyFormData) => {
  const { data, error } = await supabase
    .from("companies")
    .insert([createCompanyBody])
    .select()
    .single();

  return { data, error };
};

const updateCompany = async (
  dataToUpdate: Partial<Omit<Company, "id" | "created_at">>,
  id: string
) => {
  const { data, error } = await supabase
    .from("companies")
    .update(dataToUpdate)
    .eq("id", id)
    .select()
    .single();

  return { data, error };
};

const deleteCompany = async (id: string) => {
  const { error } = await supabase.from("companies").delete().eq("id", id);

  return { error };
};

export {
  getAllCompanies,
  createCompany,
  updateCompany,
  deleteCompany,
  getCompanyById,
};

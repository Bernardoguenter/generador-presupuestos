import { supabase } from "../../../utils/supabase";

type UpdateUserFormData = {
  company_id: string;
  email: string;
  fullName: string;
  role: string;
};

const getAllUsers = async () => {
  const { data, error } = await supabase.from("users").select("*");

  return { data, error };
};

const getUserById = async (id: string) => {
  const { data, error } = await supabase
    .from("users")
    .select()
    .eq("id", id)
    .single();

  return { data, error };
};

const getUserByEmail = async (email: string) => {
  const { data, error } = await supabase
    .from("users")
    .select("email")
    .eq("email", email)
    .single();

  return { data, error };
};

const updateUser = async (dataToUpdate: UpdateUserFormData, id: string) => {
  const { data, error } = await supabase
    .from("users")
    .update(dataToUpdate)
    .eq("id", id)
    .select()
    .single();

  return { data, error };
};

export { getAllUsers, updateUser, getUserById, getUserByEmail };

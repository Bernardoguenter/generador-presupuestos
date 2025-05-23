import { supabase } from "../../../utils/supabase";

type UpdateUserFormData = {
  company_id?: string;
  email?: string;
  fullName?: string;
  role?: string;
  isPasswordChanged?: boolean;
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

const updateUserPassword = async (password: string) => {
  const { data, error } = await supabase.auth.updateUser({
    password: password,
  });

  return { data, error };
};

const loginUser = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email,
    password: password,
  });

  return { data, error };
};

const signOutUser = async () => {
  const { error } = await supabase.auth.signOut();

  return { error };
};

const getUserRoles = async () => {
  const { data, error } = await supabase.from("roles").select("*");

  return { data, error };
};

export {
  getAllUsers,
  updateUser,
  getUserById,
  getUserByEmail,
  updateUserPassword,
  signOutUser,
  loginUser,
  getUserRoles,
};

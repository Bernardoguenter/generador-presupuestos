import { supabase } from "@/utils/supabase";

const USERS_TABLE = "users" as const;
const ROLES_TABLE = "roles" as const;

export type UpdateUserFormData = {
  company_id?: string;
  email?: string;
  fullName?: string;
  role?: string;
  isPasswordChanged?: boolean;
};

const getAllUsers = async (
  userId: string,
  page?: number,
  pageSize?: number,
  search?: string,
) => {
  let query = supabase
    .from(USERS_TABLE)
    .select("*", { count: "exact" })
    .neq("id", userId)
    .order("fullName", { ascending: true });

  if (search) {
    query = query.or(`fullName.ilike.%${search}%,email.ilike.%${search}%`);
  }

  if (page && pageSize && page > 0 && pageSize > 0) {
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    query = query.range(from, to);
  }

  const { data, error, count } = await query;

  return { data, error, count };
};

const getUserById = async (id: string) => {
  const { data, error } = await supabase
    .from(USERS_TABLE)
    .select()
    .eq("id", id)
    .single();

  return { data, error };
};

const getUserByEmail = async (email: string) => {
  const { data, error } = await supabase
    .from(USERS_TABLE)
    .select("email")
    .eq("email", email)
    .single();

  return { data, error };
};

const updateUser = async (dataToUpdate: UpdateUserFormData, id: string) => {
  const { data, error } = await supabase
    .from(USERS_TABLE)
    .update(dataToUpdate)
    .eq("id", id)
    .select()
    .single();

  return { data, error };
};

const updateUserPassword = async (password: string) => {
  const { data, error } = await supabase.auth.updateUser({ password });

  return { data, error };
};

const loginUser = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  return { data, error };
};

const signOutUser = async () => {
  const { error } = await supabase.auth.signOut();

  return { error };
};

const getUserRoles = async () => {
  const { data, error } = await supabase.from(ROLES_TABLE).select("*");

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


import type { Preferences } from "../../../helpers/types";
import { supabase } from "../../../utils/supabase";

type CreateUser = {
  email: string;
  fullName: string;
  role: string;
  company_id: string;
};

type Payload = {
  pdf: {
    filename: string;
    content: string;
  }[];
  custsomerEmail: string;
  customerName: string;
  companyName: string | undefined;
  companyEmail: string | null | undefined;
  userEmail: string | undefined;
  userName: string | undefined;
};

const setCompanyPreferences = async (
  company_id: string,
  preferences: Preferences
) => {
  const { error } = await supabase.functions.invoke("set-preferences", {
    body: { company_id, preferences },
  });
  return { error };
};

const deleteUser = async (id: string) => {
  const { error } = await supabase.functions.invoke("delete-user", {
    body: { id: id },
  });
  return { error };
};

const regeneratePassword = async (email: string) => {
  const { data, error } = await supabase.functions.invoke(
    "regenerate-password",
    {
      body: { email: email },
    }
  );

  return { data, error };
};

const sendEmailResetPassword = async (email: string, password: string) => {
  const { error } = await supabase.functions.invoke("send-reset-password", {
    body: { email, password },
  });

  return { error };
};

const createUser = async (formData: CreateUser) => {
  const { data, error } = await supabase.functions.invoke("create-user", {
    body: formData,
  });

  return { data, error };
};

const sendPassword = async (email: string, password: string) => {
  const { error } = await supabase.functions.invoke("send-password", {
    body: { email: email, password: password },
  });
  return { error };
};

const sendBudget = async (payload: Payload) => {
  const { data, error } = await supabase.functions.invoke("send-budget", {
    body: payload,
  });

  return { data, error };
};

export {
  setCompanyPreferences,
  deleteUser,
  regeneratePassword,
  sendEmailResetPassword,
  createUser,
  sendPassword,
  sendBudget,
};

import { useCallback, useMemo, useState } from "react";
import { getUserById } from "../lib";
import { useNavigate } from "react-router";
import type { User } from "@/helpers/types";
import { supabase } from "@/utils/supabase";
import { LogoutToast } from "@/utils/alerts";

export const useGetAuthUser = () => {
  const [id, setId] = useState<string | undefined>(undefined);
  const [authUser, setAuthUser] = useState<User | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const getAuthUser = useCallback(
    async (id: string) => {
      if (id) {
        const { data, error } = await getUserById(id);

        if (error) {
          console.error("Error al obtener usuario:", error.message);
          return;
        }
        setAuthUser(data);

        if (!data?.isPasswordChanged) {
          navigate("account/change-password");
        }
      }
    },
    [navigate],
  );

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      LogoutToast();
    }
  };

  const values = useMemo(
    () => ({
      authUser,
      setAuthUser,
      id,
      setId,
      loading,
      setLoading,
      handleLogout,
    }),
    [authUser, id, loading],
  );

  return {
    values,
    getAuthUser,
  };
};

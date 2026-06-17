import { useCallback, useMemo, useState } from "react";
import { getUserById, signOutUser } from "@/common/lib";
import type { User } from "@/types";
import { LogoutToast } from "@/utils/alerts";

export const useGetAuthUser = () => {
  const [id, setId] = useState<string | undefined>(undefined);
  const [authUser, setAuthUser] = useState<User | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  const getAuthUser = useCallback(
    async (id: string) => {
      if (!id) {
        setAuthUser(undefined);
        return undefined;
      }

      const { data, error } = await getUserById(id);

      if (error || !data) {
        console.error(
          "Error al obtener usuario:",
          error?.message ?? "No se encontró el perfil del usuario",
        );
        setAuthUser(undefined);
        return undefined;
      }

      setAuthUser(data);
      return data;
    },
    [],
  );

  const handleLogout = useCallback(async () => {
    const { error } = await signOutUser();
    if (!error) {
      LogoutToast();
    }
  }, []);

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
    [authUser, id, loading, handleLogout],
  );

  return {
    values,
    getAuthUser,
  };
};

import { useEffect, useState, type ReactNode } from "react";
import { supabase } from "../../../utils/supabase";
import type { User } from "../../../helpers/types";
import { AuthContext } from "./AuthContext";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [id, setId] = useState<string | undefined>(undefined);
  const [authUser, setAuthUser] = useState<User | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  const getUserById = async (id: string) => {
    if (id) {
      const { data, error } = await supabase
        .from("users")
        .select()
        .eq("id", id);

      if (error) {
        console.error("Error al obtener usuario:", error.message);
        return;
      }
      console.log("Obteniendo usuario", data);
      setAuthUser(data[0]);
    }
  };

  useEffect(() => {
    const getSessionUser = async () => {
      setLoading(true);
      const { data, error } = await supabase.auth.getUser();

      if (error) {
        console.error("Error al obtener sesión:", error.message);
        setLoading(false);
        return;
      }

      if (data?.user) {
        const userId = data.user.id;
        setId(userId);
        await getUserById(userId);
      } else {
        setId(undefined);
        setAuthUser(undefined);
      }

      setLoading(false);
    };

    getSessionUser();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session?.user?.id) {
          const userId = session.user.id;
          setId(userId);
          getUserById(userId);
        } else {
          setId(undefined);
          setAuthUser(undefined);
        }
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        authUser,
        setAuthUser,
        id,
        setId,
        loading,
        setLoading,
      }}>
      {children}
    </AuthContext.Provider>
  );
}

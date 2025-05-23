import { useEffect, useState, type ReactNode } from "react";
import { supabase } from "../../../utils/supabase";
import type { User } from "../../../helpers/types";
import { AuthContext } from "./AuthContext";
import { useNavigate } from "react-router";
import { LogoutToast } from "../../../utils/alerts";
import { getUserById } from "../../lib";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [id, setId] = useState<string | undefined>(undefined);
  const [authUser, setAuthUser] = useState<User | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const getAuthUser = async (id: string) => {
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
  };

  useEffect(() => {
    const getSessionUser = async () => {
      setLoading(true);
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        setLoading(false);
        return;
      }

      if (data?.user) {
        const userId = data.user.id;
        setId(userId);
        await getAuthUser(userId);
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
          getAuthUser(userId);
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

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      LogoutToast();
    }
  };

  return (
    <AuthContext.Provider
      value={{
        authUser,
        setAuthUser,
        id,
        setId,
        loading,
        setLoading,
        handleLogout,
      }}>
      {children}
    </AuthContext.Provider>
  );
}

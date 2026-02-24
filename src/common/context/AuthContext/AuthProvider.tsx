import { useEffect, type ReactNode } from "react";
import { supabase } from "@/utils/supabase";
import { AuthContext } from "./AuthContext";
import { useGetAuthUser } from "../../hooks";

export function AuthProvider({ children }: { children: ReactNode }) {
  const { values, getAuthUser } = useGetAuthUser();
  const { setLoading, setId, setAuthUser } = values;

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
      },
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, [getAuthUser]);

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
}

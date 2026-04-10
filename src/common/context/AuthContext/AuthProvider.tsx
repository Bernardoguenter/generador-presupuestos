import { useEffect, type ReactNode } from "react";
import { supabase } from "@/utils/supabase";
import { AuthContext } from "./AuthContext";
import { useGetAuthUser } from "@common/hooks";

export function AuthProvider({ children }: { children: ReactNode }) {
  const { values, getAuthUser } = useGetAuthUser();
  const { setLoading, setId, setAuthUser } = values;

  useEffect(() => {
    let currentUserId: string | undefined = undefined;

    const getSessionUser = async () => {
      setLoading(true);
      const { data, error } = await supabase.auth.getUser();

      if (error || !data?.user) {
        setId(undefined);
        setAuthUser(undefined);
        setLoading(false);
        return;
      }

      const userId = data.user.id;
      if (userId !== currentUserId) {
        currentUserId = userId;
        setId(userId);
        await getAuthUser(userId);
      }
      setLoading(false);
    };

    getSessionUser();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session?.user?.id) {
          const userId = session.user.id;
          if (userId !== currentUserId) {
            currentUserId = userId;
            setId(userId);
            getAuthUser(userId);
          }
        } else if (event === "SIGNED_OUT") {
          currentUserId = undefined;
          setId(undefined);
          setAuthUser(undefined);
        }
      },
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, [getAuthUser, setId, setAuthUser, setLoading]);

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
}

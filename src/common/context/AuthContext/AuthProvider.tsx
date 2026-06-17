import { useEffect, useRef, type ReactNode } from "react";
import { supabase } from "@/utils/supabase";
import { AuthContext } from "./AuthContext";
import { useGetAuthUser } from "@common/hooks";

export function AuthProvider({ children }: { children: ReactNode }) {
  const { values, getAuthUser } = useGetAuthUser();
  const { setLoading, setId, setAuthUser } = values;
  const currentUserIdRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    const clearAuthState = () => {
      currentUserIdRef.current = undefined;
      setId(undefined);
      setAuthUser(undefined);
    };

    const hydrateAuthUser = async (userId: string) => {
      currentUserIdRef.current = userId;
      setId(userId);
      const user = await getAuthUser(userId);

      if (!user) {
        clearAuthState();
      }
    };

    const getSessionUser = async () => {
      setLoading(true);

      try {
        const { data, error } = await supabase.auth.getUser();

        if (error || !data?.user) {
          clearAuthState();
          return;
        }

        const userId = data.user.id;
        if (userId !== currentUserIdRef.current) {
          await hydrateAuthUser(userId);
        }
      } catch (error) {
        console.error("Error al inicializar sesión:", error);
        clearAuthState();
      } finally {
        setLoading(false);
      }
    };

    getSessionUser();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session?.user?.id) {
          const userId = session.user.id;
          if (userId !== currentUserIdRef.current) {
            setLoading(true);
            hydrateAuthUser(userId).finally(() => setLoading(false));
          }
        } else if (event === "SIGNED_OUT") {
          clearAuthState();
        }
      },
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, [getAuthUser, setId, setAuthUser, setLoading]);

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
}

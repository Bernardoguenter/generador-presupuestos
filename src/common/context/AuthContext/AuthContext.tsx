import { createContext, useContext } from "react";
import type { User } from "../../../helpers/types";

interface AuthContextInterface {
  authUser: User | undefined;
  setAuthUser: React.Dispatch<React.SetStateAction<User | undefined>>;
  id: string | undefined;
  setId: React.Dispatch<React.SetStateAction<string | undefined>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  handleLogout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextInterface | undefined>(
  undefined
);

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
}

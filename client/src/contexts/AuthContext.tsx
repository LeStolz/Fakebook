import { ReactNode, createContext, useContext } from "react";

type User = {};

type AuthContext = {
  user: User | null;
};

const AuthContext = createContext<AuthContext | null>(null);

export function useAuth() {
  return useContext(AuthContext) as AuthContext;
}

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  return (
    <AuthContext.Provider value={{ user: {} }}>{children}</AuthContext.Provider>
  );
}

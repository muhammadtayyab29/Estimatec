import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { User, Role } from "@/data/mockData";

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
}
interface AuthCtx extends AuthState {
  signIn: (user: User, token: string) => void;
  signOut: () => void;
}

const Ctx = createContext<AuthCtx | null>(null);
const KEY = "estimatec.auth";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({ user: null, token: null, loading: true });

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const { user, token } = JSON.parse(raw);
        setState({ user, token, loading: false });
        return;
      }
    } catch {}
    setState({ user: null, token: null, loading: false });
  }, []);

  const signIn = (user: User, token: string) => {
    localStorage.setItem(KEY, JSON.stringify({ user, token }));
    setState({ user, token, loading: false });
  };
  const signOut = () => {
    localStorage.removeItem(KEY);
    setState({ user: null, token: null, loading: false });
  };

  return <Ctx.Provider value={{ ...state, signIn, signOut }}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useAuth outside AuthProvider");
  return v;
}

export function homeForRole(role: Role) {
  return role === "admin" ? "/admin/dashboard"
    : role === "estimator" ? "/estimator/dashboard"
    : "/agent/dashboard";
}

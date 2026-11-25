"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { ACCESS_CHANGED, ApiError, api, setCsrfToken } from "@/lib/api";

export type User = { id: number; name: string; email: string };
export type Profile = { user: User; roles: string[]; permissions: string[]; csrfToken: string };

type Ctx = {
  ready: boolean;
  user: User | null;
  roles: string[];
  permissions: string[];
  // Only decides what to SHOW. The API checks every request itself.
  can: (permission: string) => boolean;
  login: (email: string, password: string) => Promise<Profile>;
  register: (name: string, email: string, password: string) => Promise<Profile>;
  // For endpoints that return a fresh profile (rename, password change).
  apply: (profile: Profile | null) => void;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
};

const AuthContext = createContext<Ctx | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [ready, setReady] = useState(false);
  const pathname = usePathname();

  const apply = useCallback((next: Profile | null) => {
    setCsrfToken(next?.csrfToken ?? null);
    // Keep the same object when nothing changed, to avoid needless re-renders.
    setProfile((cur) => (JSON.stringify(cur) === JSON.stringify(next) ? cur : next));
    setReady(true);
  }, []);

  const refresh = useCallback(async () => {
    try {
      apply(await api<Profile>("/auth/me"));
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) apply(null);
      else setReady(true);
    }
  }, [apply]);

  // Re-read roles and permissions on navigation, on tab focus and after a
  // refused request, so role changes show up without logging in again.
  useEffect(() => {
    refresh();
  }, [pathname, refresh]);
  useEffect(() => {
    window.addEventListener("focus", refresh);
    window.addEventListener(ACCESS_CHANGED, refresh);
    return () => {
      window.removeEventListener("focus", refresh);
      window.removeEventListener(ACCESS_CHANGED, refresh);
    };
  }, [refresh]);

  const value = useMemo<Ctx>(
    () => ({
      ready,
      user: profile?.user ?? null,
      roles: profile?.roles ?? [],
      permissions: profile?.permissions ?? [],
      can: (permission) => profile?.permissions.includes(permission) ?? false,
      login: async (email, password) => {
        const next = await api<Profile>("/auth/login", { method: "POST", body: { email, password } });
        apply(next);
        return next;
      },
      register: async (name, email, password) => {
        const next = await api<Profile>("/auth/register", {
          method: "POST",
          body: { name, email, password },
        });
        apply(next);
        return next;
      },
      logout: async () => {
        try {
          await api("/auth/logout", { method: "POST" });
        } catch {
          // A stale CSRF token (login in another tab) is the usual cause:
          // reload it and try once more. A second failure is reported.
          await refresh();
          await api("/auth/logout", { method: "POST" });
        }
        apply(null);
      },
      apply,
      refresh,
    }),
    [profile, ready, apply, refresh]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}
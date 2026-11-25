"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import type { Product } from "@/lib/types";

// Guests keep favorites (ids only) in localStorage. Logged-in users keep them
// on the server; guest favorites are merged in at login.
const KEY = "cmb-wishlist";

type Ctx = {
  ids: string[];
  items: Product[];
  count: number;
  has: (id: string) => boolean;
  toggle: (id: string) => void;
  remove: (id: string) => void;
  open: boolean;
  setOpen: (v: boolean) => void;
};

const WishlistContext = createContext<Ctx | null>(null);

function readLocal(): string[] {
  try {
    const value = JSON.parse(localStorage.getItem(KEY) ?? "[]");
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

function writeLocal(ids: string[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(ids));
  } catch {
    /* ignore */
  }
}

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const { user, ready } = useAuth();
  const userId = user?.id ?? null;
  const [ids, setIds] = useState<string[]>([]);
  const [catalog, setCatalog] = useState<Product[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!ready) return;
    if (!userId) {
      setIds(readLocal());
      return;
    }
    let cancelled = false;
    (async () => {
      const guest = readLocal();
      await Promise.allSettled(
        guest.map((id) => api(`/me/wishlist/${id}`, { method: "PUT" }))
      );
      const { data } = await api<{ data: Product[] }>("/me/wishlist");
      writeLocal([]);
      if (!cancelled) setIds(data.map((p) => p.id));
    })().catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [userId, ready]);

  // Product details are only loaded once there is something to show.
  const needsCatalog = ids.some((id) => !catalog.some((p) => p.id === id));
  useEffect(() => {
    if (!needsCatalog) return;
    api<{ data: Product[] }>("/products?limit=100")
      .then((r) => setCatalog(r.data))
      .catch(() => {});
  }, [needsCatalog, ids]);

  const change = useCallback(
    (id: string, add: boolean) => {
      const next = add ? [...ids.filter((x) => x !== id), id] : ids.filter((x) => x !== id);
      setIds(next);
      if (!userId) writeLocal(next);
      else {
        api(`/me/wishlist/${id}`, { method: add ? "PUT" : "DELETE" }).catch(() => setIds(ids));
      }
    },
    [ids, userId]
  );

  const value = useMemo<Ctx>(
    () => ({
      ids,
      items: ids
        .map((id) => catalog.find((p) => p.id === id))
        .filter((p): p is Product => Boolean(p)),
      count: ids.length,
      has: (id) => ids.includes(id),
      toggle: (id) => change(id, !ids.includes(id)),
      remove: (id) => change(id, false),
      open,
      setOpen,
    }),
    [ids, catalog, open, change]
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within <WishlistProvider>");
  return ctx;
}
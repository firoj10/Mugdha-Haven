"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from "react";
import type { Product } from "@/data/products";

// Client-only cart. State lives in React + localStorage. When the backend adds
// real orders, this is where you'd sync to it — the UI talks only to useCart().

export type CartItem = { product: Product; qty: number };

type State = CartItem[];
type Action =
  | { type: "add"; product: Product; qty?: number }
  | { type: "remove"; id: string }
  | { type: "setQty"; id: string; qty: number }
  | { type: "clear" }
  | { type: "hydrate"; items: State };

const STORAGE_KEY = "cmb-cart";

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "add": {
      const existing = state.find((i) => i.product.id === action.product.id);
      if (existing) {
        return state.map((i) =>
          i.product.id === action.product.id
            ? { ...i, qty: i.qty + (action.qty ?? 1) }
            : i
        );
      }
      return [...state, { product: action.product, qty: action.qty ?? 1 }];
    }
    case "remove":
      return state.filter((i) => i.product.id !== action.id);
    case "setQty":
      return state
        .map((i) =>
          i.product.id === action.id ? { ...i, qty: Math.max(1, action.qty) } : i
        )
        .filter((i) => i.qty > 0);
    case "clear":
      return [];
    case "hydrate":
      return action.items;
    default:
      return state;
  }
}

type CartContextValue = {
  items: CartItem[];
  count: number;
  subtotal: number;
  add: (product: Product, qty?: number) => void;
  remove: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, dispatch] = useReducer(reducer, []);

  // Load once on mount.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) dispatch({ type: "hydrate", items: JSON.parse(raw) });
    } catch {
      /* ignore corrupt storage */
    }
  }, []);

  // Persist on change.
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const value = useMemo<CartContextValue>(() => {
    const count = items.reduce((n, i) => n + i.qty, 0);
    const subtotal = items.reduce((s, i) => s + i.product.price * i.qty, 0);
    return {
      items,
      count,
      subtotal,
      add: (product, qty) => dispatch({ type: "add", product, qty }),
      remove: (id) => dispatch({ type: "remove", id }),
      setQty: (id, qty) => dispatch({ type: "setQty", id, qty }),
      clear: () => dispatch({ type: "clear" }),
    };
  }, [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within <CartProvider>");
  return ctx;
}

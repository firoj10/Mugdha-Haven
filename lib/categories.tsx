"use client";

import { createContext, useContext } from "react";

const CategoriesContext = createContext<string[]>([]);

export function CategoriesProvider({
  categories,
  children,
}: {
  categories: string[];
  children: React.ReactNode;
}) {
  return (
    <CategoriesContext.Provider value={categories}>{children}</CategoriesContext.Provider>
  );
}

export const useCategories = () => useContext(CategoriesContext);
"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { AnimatePresence, motion } from "framer-motion";
import { ProductCard } from "@/components/product-card";
import type { Category, Product } from "@/data/products";

export function ShopGrid({
  products,
  categories,
}: {
  products: Product[];
  categories: Category[];
}) {
  const t = useTranslations("shop");
  const params = useSearchParams();

  // The URL is the single source of truth, so links from the home page,
  // footer and search always stay in sync with the chips.
  const fromUrl = params.get("category") as Category | null;
  const active: Category | "all" =
    fromUrl && categories.includes(fromUrl) ? fromUrl : "all";
  const q = (params.get("q") ?? "").trim().toLowerCase();

  const filtered = useMemo(
    () =>
      products.filter(
        (p) =>
          (active === "all" || p.category === active) &&
          (!q ||
            `${p.brand} ${p.name} ${p.category}`.toLowerCase().includes(q))
      ),
    [active, q, products]
  );

  return (
    <>
      {filtered.length === 0 ? (
        <p className="py-20 text-center text-muted-foreground">{t("empty")}</p>
      ) : (
        <motion.div
          layout
          className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((p, i) => (
              <motion.div
                key={p.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
              >
                <ProductCard product={p} index={i} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </>
  );
}

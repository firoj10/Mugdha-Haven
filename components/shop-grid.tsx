"use client";

import { useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { AnimatePresence, motion } from "framer-motion";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
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
  const router = useRouter();
  const pathname = usePathname();

  // The URL is the single source of truth, so links from the home page,
  // footer and search always stay in sync with the chips.
  const fromUrl = params.get("category") as Category | null;
  const active: Category | "all" =
    fromUrl && categories.includes(fromUrl) ? fromUrl : "all";
  const q = (params.get("q") ?? "").trim().toLowerCase();

  function setActive(c: Category | "all") {
    const next = new URLSearchParams(params.toString());
    if (c === "all") next.delete("category");
    else next.set("category", c);
    const qs = next.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }

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
      <div className="flex flex-wrap gap-2">
        <Chip label={t("all")} active={active === "all"} onClick={() => setActive("all")} />
        {categories.map((c) => (
          <Chip key={c} label={c} active={active === c} onClick={() => setActive(c)} />
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="py-20 text-center text-muted-foreground">{t("empty")}</p>
      ) : (
        <motion.div
          layout
          className="mt-10 grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4"
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

function Chip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <Button
      type="button"
      onClick={onClick}
      size="sm"
      variant={active ? "default" : "outline"}
      className={cn(!active && "bg-card")}
    >
      {label}
    </Button>
  );
}

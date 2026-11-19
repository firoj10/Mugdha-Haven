"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { Product } from "@/data/products";

// Inline EN/BN toggle on the product page — independent of the site locale,
// defaulting to it.
export function ProductDescription({ product }: { product: Product }) {
  const t = useTranslations("product");
  const locale = useLocale();
  const [lang, setLang] = useState<"en" | "bn">(locale === "bn" ? "bn" : "en");
  const text = lang === "bn" ? product.description_bn : product.description_en;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <h3 className="text-sm font-semibold uppercase tracking-wide">
          {t("description")}
        </h3>
        <div className="inline-flex rounded-full border border-primary/30 p-0.5 text-xs">
          {(["en", "bn"] as const).map((l) => (
            <button
              key={l}
              onClick={() => setLang(l)}
              aria-pressed={lang === l}
              className={cn(
                "rounded-full px-3 py-0.5 transition",
                lang === l
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground/70"
              )}
            >
              {l === "en" ? "EN" : "বাংলা"}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.p
          key={lang}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.25 }}
          className={cn(
            "max-w-prose leading-relaxed text-muted-foreground",
            lang === "bn" && "font-bangla"
          )}
        >
          {text}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}

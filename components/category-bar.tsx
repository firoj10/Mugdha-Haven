"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  Baby,
  Droplets,
  Eye,
  FlaskConical,
  LayoutGrid,
  Sparkles,
  Sun,
  Waves,
  type LucideIcon,
} from "lucide-react";
import { products, type Category } from "@/data/products";
import { cn } from "@/lib/utils";

const ICONS: Record<Category, LucideIcon> = {
  Essence: FlaskConical,
  Cream: Sparkles,
  Serum: Droplets,
  Cleanser: Waves,
  "Baby Care": Baby,
  Sunscreen: Sun,
  "Eye Care": Eye,
};

const CATS = [...new Set(products.map((p) => p.category))] as Category[];

// Always-visible category menu: every category is one click away.
// Each item is a clear labelled button with an icon; the current one is filled.
export function CategoryBar() {
  const t = useTranslations("shop");
  const pathname = usePathname();
  const params = useSearchParams();
  const onShop = pathname === "/shop";
  const current = onShop ? params.get("category") : null;

  const item =
    "flex shrink-0 items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-semibold transition-all";
  const idle =
    "border-border bg-card text-foreground hover:border-foreground/40 hover:bg-secondary/50";
  const on = "border-cta bg-cta text-cta-foreground shadow-md shadow-foreground/15";

  return (
    <nav aria-label="Categories" className="border-b border-border bg-secondary/30">
      <ul className="no-scrollbar container flex items-center gap-2.5 overflow-x-auto py-3 lg:justify-center">
        <li>
          <Link
            href="/shop"
            className={cn(item, onShop && !current ? on : idle)}
          >
            <LayoutGrid className="size-4" />
            {t("all")}
          </Link>
        </li>
        {CATS.map((c) => {
          const Icon = ICONS[c] ?? LayoutGrid;
          return (
            <li key={c}>
              <Link
                href={`/shop?category=${encodeURIComponent(c)}`}
                className={cn(item, current === c ? on : idle)}
              >
                <Icon className="size-4" />
                {c}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

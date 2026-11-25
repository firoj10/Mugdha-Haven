"use client";

import { useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Eye, Heart, ShoppingBag, Star } from "lucide-react";
import { Reveal } from "@/components/motion";
import { ProductImage } from "@/components/product-image";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { QuickView } from "@/components/quick-view";
import { useCart } from "@/lib/cart";
import { useWishlist } from "@/lib/wishlist";
import { cn, formatPrice } from "@/lib/utils";
import type { Product } from "@/lib/types";

// Sizes let each section look different:
//  lg — featured/favorites, md — shop grid (default), sm — compact
type Size = "lg" | "md" | "sm";

const S: Record<
  Size,
  { img: string; body: string; name: string; price: string; btn: string; icon: string }
> = {
  lg: {
    img: "aspect-square",
    body: "p-5",
    name: "text-base",
    price: "text-xl",
    btn: "h-12",
    icon: "size-10",
  },
  md: {
    img: "aspect-square",
    body: "p-4",
    name: "text-[15px]",
    price: "text-lg",
    btn: "h-11",
    icon: "size-9",
  },
  sm: {
    img: "aspect-[4/3]",
    body: "p-3.5",
    name: "text-sm",
    price: "text-base",
    btn: "h-10",
    icon: "size-8",
  },
};

function Stars({ value }: { value: number }) {
  return (
    <span className="flex items-center gap-0.5" aria-label={`${value} / 5`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          className={cn(
            "size-3.5",
            n <= Math.round(value)
              ? "fill-highlight text-highlight"
              : "fill-transparent text-foreground/25"
          )}
        />
      ))}
    </span>
  );
}

export function ProductCard({
  product,
  index = 0,
  size = "md",
}: {
  product: Product;
  index?: number;
  size?: Size;
}) {
  const t = useTranslations("product");
  const ts = useTranslations("site");
  const { add } = useCart();
  const { has, toggle } = useWishlist();
  const [quick, setQuick] = useState(false);
  const fav = has(product.id);
  const s = S[size];
  const off = product.compareAt
    ? Math.round((1 - product.price / product.compareAt) * 100)
    : 0;

  // Hover actions slide in from the right; always visible on touch screens.
  const action = cn(
    "flex items-center justify-center rounded-lg bg-card text-foreground shadow-md shadow-foreground/20 transition-all duration-300 hover:bg-cta hover:text-cta-foreground md:translate-x-3 md:opacity-0 md:group-hover:translate-x-0 md:group-hover:opacity-100",
    s.icon
  );

  return (
    <Reveal delay={(index % 4) * 0.06} className="h-full">
      <article className="group flex h-full flex-col overflow-hidden rounded-xl bg-card shadow-sm ring-1 ring-foreground/10 transition-all duration-500 hover:-translate-y-1 hover:shadow-xl hover:shadow-foreground/15 hover:ring-foreground/20">
        {/* Image */}
        <div className="relative overflow-hidden bg-secondary/40">
          <Link
            href={`/product/${product.slug}`}
            aria-label={product.name}
            className={cn("relative block", s.img)}
          >
            <ProductImage
              product={product}
              className="h-full w-full transition-transform duration-700 group-hover:scale-105"
            />
          </Link>

          {off > 0 && (
            <span className="absolute left-3 top-3 rounded-md bg-highlight px-2 py-1 text-[11px] font-bold leading-none text-highlight-foreground shadow-sm">
              -{off}%
            </span>
          )}

          <div className="absolute right-3 top-3 flex flex-col gap-2">
            <button
              type="button"
              aria-label={ts("favorites")}
              aria-pressed={fav}
              title={ts("favorites")}
              onClick={() => toggle(product.id)}
              className={cn(
                action,
                fav && "bg-cta text-cta-foreground md:translate-x-0 md:opacity-100"
              )}
            >
              <Heart className={cn("size-4", fav && "fill-current")} />
            </button>
            <button
              type="button"
              aria-label={ts("quickView")}
              title={ts("quickView")}
              onClick={() => setQuick(true)}
              className={cn(action, "md:delay-75")}
            >
              <Eye className="size-4" />
            </button>
            <button
              type="button"
              aria-label={t("addToCart")}
              title={t("addToCart")}
              onClick={() => add(product)}
              className={cn(action, "md:delay-150")}
            >
              <ShoppingBag className="size-4" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className={cn("flex flex-1 flex-col", s.body)}>
          <p className="truncate text-[11px] font-semibold uppercase tracking-wider text-foreground/60">
            {product.brand} · {product.category}
          </p>

          <Link
            href={`/product/${product.slug}`}
            className={cn(
              "mt-1.5 line-clamp-2 min-h-[2.7em] font-semibold leading-snug text-foreground transition-colors hover:text-primary",
              s.name
            )}
          >
            {product.name}
          </Link>

          <div className="mt-2 flex items-center gap-2">
            <Stars value={product.rating} />
            <span className="text-xs font-medium text-foreground/70">
              {product.rating}
            </span>
          </div>

          <div className="mt-3 flex items-baseline gap-2">
            <span className={cn("font-extrabold text-foreground", s.price)}>
              {formatPrice(product.price)}
            </span>
            {product.compareAt && (
              <span className="text-sm font-medium text-foreground/50 line-through">
                {formatPrice(product.compareAt)}
              </span>
            )}
          </div>

          <AddToCartButton
            product={product}
            size="sm"
            className={cn(
              "mt-4 w-full rounded-lg bg-cta text-sm font-semibold normal-case tracking-normal text-cta-foreground shadow-sm transition-colors hover:bg-highlight hover:text-highlight-foreground",
              s.btn
            )}
          />
        </div>
      </article>

      <QuickView product={product} open={quick} onOpenChange={setQuick} />
    </Reveal>
  );
}

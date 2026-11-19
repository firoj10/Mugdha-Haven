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
import type { Product } from "@/data/products";

// Three sizes so each section can look different:
//  lg — featured/favorites (big image, bigger type)
//  md — shop grid (default)
//  sm — compact (landscape image, tight body)
type Size = "lg" | "md" | "sm";

const S: Record<
  Size,
  {
    img: string;
    pad: string;
    name: string;
    price: string;
    btn: string;
    icon: string;
    showCat: boolean;
  }
> = {
  lg: {
    img: "aspect-square",
    pad: "px-3 pb-2 pt-4",
    name: "text-base",
    price: "text-xl",
    btn: "h-11 text-sm",
    icon: "size-10",
    showCat: true,
  },
  md: {
    img: "aspect-square",
    pad: "px-2.5 pb-1.5 pt-3",
    name: "text-sm",
    price: "text-lg",
    btn: "h-10 text-sm",
    icon: "size-9",
    showCat: true,
  },
  sm: {
    img: "aspect-[4/3]",
    pad: "px-2 pb-1 pt-2.5",
    name: "text-[13px]",
    price: "text-base",
    btn: "h-9 text-xs",
    icon: "size-8",
    showCat: true,
  },
};

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

  // Hover action: slides in from the right, staggered. Always visible on touch.
  const action = cn(
    "flex items-center justify-center rounded-full bg-card text-foreground shadow-lg shadow-foreground/20 transition-all duration-300 hover:bg-cta hover:text-cta-foreground md:translate-x-3 md:opacity-0 md:group-hover:translate-x-0 md:group-hover:opacity-100",
    s.icon
  );

  return (
    <Reveal delay={(index % 4) * 0.06} className="h-full">
      <article className="group flex h-full flex-col rounded-3xl border border-foreground/10 bg-card p-2 transition-all duration-500 hover:-translate-y-1 hover:border-foreground/25 hover:shadow-xl hover:shadow-foreground/10">
        {/* Image */}
        <div className="relative overflow-hidden rounded-2xl bg-secondary/40">
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
            <span className="absolute left-2.5 top-2.5 rounded-full bg-cta px-2.5 py-1 text-[11px] font-bold text-cta-foreground">
              -{off}%
            </span>
          )}

          {/* Hover icons */}
          <div className="absolute right-2.5 top-2.5 flex flex-col gap-2">
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
        <div className={cn("flex flex-1 flex-col", s.pad)}>
          <div className="flex items-center justify-between gap-2 text-foreground/75">
            <span className="truncate text-[11px] font-bold uppercase tracking-wider">
              {product.brand}
              {s.showCat && <span className="font-medium normal-case tracking-normal"> · {product.category}</span>}
            </span>
            <span className="flex shrink-0 items-center gap-1 text-xs font-medium">
              <Star className="size-3 fill-current" />
              {product.rating}
            </span>
          </div>

          <Link
            href={`/product/${product.slug}`}
            className={cn(
              "mt-1.5 line-clamp-2 font-semibold leading-snug text-foreground transition-colors hover:text-primary",
              s.name
            )}
          >
            {product.name}
          </Link>

          <div className="mb-3 mt-2 flex items-baseline gap-2">
            <span className={cn("font-extrabold text-foreground", s.price)}>
              {formatPrice(product.price)}
            </span>
            {product.compareAt && (
              <span className="text-xs font-medium text-foreground/60 line-through">
                {formatPrice(product.compareAt)}
              </span>
            )}
          </div>

          <AddToCartButton
            product={product}
            size="sm"
            className={cn(
              "mt-auto w-full rounded-full bg-cta font-semibold text-cta-foreground transition-colors hover:bg-cta/85",
              s.btn
            )}
          />
        </div>
      </article>

      <QuickView product={product} open={quick} onOpenChange={setQuick} />
    </Reveal>
  );
}

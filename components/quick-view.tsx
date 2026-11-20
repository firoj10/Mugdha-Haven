"use client";

import { useState } from "react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { ArrowUpRight, Check, Heart, Minus, Plus, ShoppingBag, Star } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { ProductImage } from "@/components/product-image";
import { useCart } from "@/lib/cart";
import { useWishlist } from "@/lib/wishlist";
import { cn, formatPrice } from "@/lib/utils";
import type { Product } from "@/data/products";

export function QuickView({
  product,
  open,
  onOpenChange,
}: {
  product: Product;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const t = useTranslations("product");
  const ts = useTranslations("site");
  const locale = useLocale();
  const { add } = useCart();
  const { has, toggle } = useWishlist();
  const [qty, setQty] = useState(1);
  const [done, setDone] = useState(false);
  const fav = has(product.id);
  const off = product.compareAt
    ? Math.round((1 - product.price / product.compareAt) * 100)
    : 0;

  function addToCart() {
    add(product, qty);
    setDone(true);
    setTimeout(() => setDone(false), 1600);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <div className="grid md:grid-cols-2">
          <div className="relative bg-secondary/40 p-4 md:p-6">
            <ProductImage
              product={product}
              className="aspect-square w-full rounded-sm"
              priority
              sizes="(max-width: 768px) 100vw, 480px"
            />
            {off > 0 && (
              <span className="absolute left-7 top-7 rounded-sm bg-highlight px-3 py-1 text-xs font-bold text-highlight-foreground">
                -{off}%
              </span>
            )}
          </div>

          <div className="flex flex-col gap-4 p-6 md:p-8">
            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                {product.brand} · {product.category}
              </span>
              <DialogTitle className="mt-2 font-sans text-xl font-bold leading-snug sm:text-2xl">
                {product.name}
              </DialogTitle>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <span className="flex">
                {[1, 2, 3, 4, 5].map((n) => (
                  <Star
                    key={n}
                    className={cn(
                      "size-4",
                      n <= Math.round(product.rating)
                        ? "fill-highlight text-highlight"
                        : "text-border"
                    )}
                  />
                ))}
              </span>
              <span className="text-muted-foreground">{product.rating}</span>
            </div>

            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-price">{formatPrice(product.price)}</span>
              {product.compareAt && (
                <span className="text-base text-muted-foreground line-through">
                  {formatPrice(product.compareAt)}
                </span>
              )}
            </div>

            <DialogDescription className="text-sm leading-relaxed text-muted-foreground">
              {locale === "bn" ? product.description_bn : product.description_en}
            </DialogDescription>

            <div className="mt-auto flex flex-col gap-3 pt-2">
              <div className="flex items-center gap-3">
                <div className="flex items-center rounded-sm border border-border bg-card">
                  <button
                    aria-label="Decrease"
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="flex size-10 items-center justify-center rounded-sm transition hover:bg-secondary/60"
                  >
                    <Minus className="size-4" />
                  </button>
                  <span className="w-8 text-center text-sm font-semibold">{qty}</span>
                  <button
                    aria-label="Increase"
                    onClick={() => setQty((q) => q + 1)}
                    className="flex size-10 items-center justify-center rounded-sm transition hover:bg-secondary/60"
                  >
                    <Plus className="size-4" />
                  </button>
                </div>

                <button
                  onClick={addToCart}
                  className="flex h-12 flex-1 items-center justify-center gap-2 rounded-sm bg-cta text-[13px] font-bold uppercase tracking-[0.12em] text-cta-foreground transition hover:bg-cta/90"
                >
                  {done ? <Check className="size-4" /> : <ShoppingBag className="size-4" />}
                  {done ? t("added") : t("addToCart")}
                </button>

                <button
                  aria-label={ts("favorites")}
                  aria-pressed={fav}
                  onClick={() => toggle(product.id)}
                  className={cn(
                    "flex size-12 shrink-0 items-center justify-center rounded-sm border transition",
                    fav
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-card hover:border-primary"
                  )}
                >
                  <Heart className={cn("size-5", fav && "fill-current")} />
                </button>
              </div>

              <Link
                href={`/product/${product.slug}`}
                onClick={() => onOpenChange(false)}
                className="inline-flex items-center gap-1 self-start text-sm font-medium text-primary underline-offset-4 hover:underline"
              >
                {ts("viewDetails")} <ArrowUpRight className="size-4" />
              </Link>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

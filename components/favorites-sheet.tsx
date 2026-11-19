"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { Heart, ShoppingBag, Trash2 } from "lucide-react";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { ProductImage } from "@/components/product-image";
import { useCart } from "@/lib/cart";
import { useWishlist } from "@/lib/wishlist";
import { formatPrice } from "@/lib/utils";

// Slide-over list of favorited products. Opened from the navbar heart.
export function FavoritesSheet() {
  const ts = useTranslations("site");
  const t = useTranslations("product");
  const { items, open, setOpen, remove } = useWishlist();
  const { add } = useCart();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent className="w-full max-w-md gap-4 sm:w-[26rem]">
        <SheetTitle className="flex items-center gap-2 font-sans text-lg font-bold">
          <Heart className="size-5 fill-primary text-primary" />
          {ts("favorites")}
          <span className="rounded-full bg-secondary px-2 py-0.5 text-xs font-semibold text-secondary-foreground">
            {items.length}
          </span>
        </SheetTitle>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
            <span className="flex size-16 items-center justify-center rounded-full bg-secondary/60">
              <Heart className="size-7 text-primary" />
            </span>
            <p className="max-w-[16rem] text-sm text-muted-foreground">{ts("favEmpty")}</p>
            <Link
              href="/shop"
              onClick={() => setOpen(false)}
              className="rounded-full bg-cta px-6 py-2.5 text-sm font-semibold text-cta-foreground"
            >
              {ts("viewAll")}
            </Link>
          </div>
        ) : (
          <ul className="-mr-2 flex-1 space-y-3 overflow-y-auto pr-2">
            {items.map((p) => (
              <li
                key={p.id}
                className="flex gap-3 rounded-2xl border border-border bg-card p-2.5"
              >
                <Link
                  href={`/product/${p.slug}`}
                  onClick={() => setOpen(false)}
                  className="size-20 shrink-0 overflow-hidden rounded-xl"
                >
                  <ProductImage product={p} className="h-full w-full" />
                </Link>
                <div className="flex min-w-0 flex-1 flex-col">
                  <Link
                    href={`/product/${p.slug}`}
                    onClick={() => setOpen(false)}
                    className="line-clamp-2 text-sm font-semibold leading-snug hover:text-primary"
                  >
                    {p.name}
                  </Link>
                  <span className="text-xs text-muted-foreground">{p.brand}</span>
                  <div className="mt-auto flex items-center justify-between pt-1">
                    <span className="text-sm font-bold text-price">{formatPrice(p.price)}</span>
                    <div className="flex items-center gap-1.5">
                      <button
                        aria-label={t("addToCart")}
                        onClick={() => add(p)}
                        className="flex h-8 items-center gap-1.5 rounded-full bg-cta px-3 text-xs font-semibold text-cta-foreground transition hover:bg-cta/90"
                      >
                        <ShoppingBag className="size-3.5" />
                        {t("addToCart")}
                      </button>
                      <button
                        aria-label={`Remove ${p.name}`}
                        onClick={() => remove(p.id)}
                        className="flex size-8 items-center justify-center rounded-full text-muted-foreground transition hover:bg-secondary/60 hover:text-foreground"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </SheetContent>
    </Sheet>
  );
}

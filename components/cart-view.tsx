"use client";

import Link from "next/link";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "@/lib/cart";
import { CheckoutForm } from "@/components/checkout-form";
import { ProductImage } from "@/components/product-image";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { formatPrice } from "@/lib/utils";

export function CartView() {
  const t = useTranslations("cart");
  const tc = useTranslations("checkout");
  const { items, subtotal, setQty, remove } = useCart();
  const [orderNo, setOrderNo] = useState("");

  if (orderNo) {
    return (
      <div role="status" className="flex flex-col items-center gap-3 py-24 text-center">
        <p className="text-2xl font-semibold">{tc("done")}</p>
        <p>
          {tc("orderNo")}: <strong>{orderNo}</strong>
        </p>
        <Button asChild>
          <Link href="/shop">{t("continue")}</Link>
        </Button>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 py-24 text-center">
        <p className="text-muted-foreground">{t("empty")}</p>
        <Button asChild>
          <Link href="/shop">{t("continue")}</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
      <ul className="divide-y divide-border/60">
        {items.map(({ product, qty }) => (
          <li key={product.id} className="flex gap-4 py-5">
            <ProductImage
              product={product}
              className="size-24 shrink-0 rounded-xl"
            />
            <div className="flex flex-1 flex-col">
              <div className="flex justify-between gap-4">
                <div>
                  <p className="text-xs uppercase text-muted-foreground">
                    {product.brand}
                  </p>
                  <Link
                    href={`/product/${product.slug}`}
                    className="font-medium hover:text-primary"
                  >
                    {product.name}
                  </Link>
                </div>
                <span className="font-semibold">
                  {formatPrice(product.price * qty)}
                </span>
              </div>
              <div className="mt-auto flex items-center justify-between pt-3">
                <div className="inline-flex items-center rounded-full border border-border">
                  <button
                    onClick={() => setQty(product.id, qty - 1)}
                    className="p-2"
                    aria-label={`${t("qty")} -1`}
                  >
                    <Minus className="size-4" />
                  </button>
                  <span className="w-8 text-center text-sm">{qty}</span>
                  <button
                    onClick={() => setQty(product.id, qty + 1)}
                    className="p-2"
                    aria-label={`${t("qty")} +1`}
                  >
                    <Plus className="size-4" />
                  </button>
                </div>
                <button
                  onClick={() => remove(product.id)}
                  className="inline-flex items-center gap-1 text-sm text-muted-foreground transition hover:text-primary"
                >
                  <Trash2 className="size-4" />
                  {t("remove")}
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <aside className="h-fit rounded-2xl border border-border/60 bg-card p-6">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">{t("subtotal")}</span>
          <span className="text-lg font-semibold">{formatPrice(subtotal)}</span>
        </div>
        <Separator className="my-4" />
        <CheckoutForm onPlaced={setOrderNo} />
        <p className="mt-3 text-xs text-muted-foreground">{t("note")}</p>
      </aside>
    </div>
  );
}

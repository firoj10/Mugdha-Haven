"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { useCart } from "@/lib/cart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function CheckoutForm({ onPlaced }: { onPlaced: (orderNo: string) => void }) {
  const t = useTranslations("checkout");
  const { user } = useAuth();
  const { items, clear } = useCart();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const { note, ...fields } = Object.fromEntries(
      new FormData(e.currentTarget)
    ) as Record<string, string>;
    setBusy(true);
    setError("");
    try {
      const { data } = await api<{ data: { orderNo: string } }>("/orders", {
        method: "POST",
        body: {
          ...fields,
          ...(note && { note }),
          items: items.map((i) => ({ productId: i.product.id, qty: i.qty })),
        },
      });
      onPlaced(data.orderNo);
      clear();
    } catch (err) {
      setError((err as Error).message);
      setBusy(false);
    }
  }

  const field = (name: string, label: string, extra: React.InputHTMLAttributes<HTMLInputElement>) => (
    <Input name={name} placeholder={label} aria-label={label} {...extra} />
  );

  return (
    <form onSubmit={submit} method="post" className="flex flex-col gap-3">
      {field("customerName", t("name"), { required: true, minLength: 2, defaultValue: user?.name })}
      {field("phone", t("phone"), { required: true, type: "tel" })}
      {field("address", t("address"), { required: true, minLength: 5 })}
      {field("city", t("city"), { required: true, minLength: 2 })}
      {field("note", t("note"), {})}
      {error && (
        <p role="alert" className="rounded-sm bg-red-100 px-3 py-2 text-sm text-red-800">
          {error}
        </p>
      )}
      <Button type="submit" size="lg" disabled={busy}>
        {busy ? t("placing") : t("place")}
      </Button>
    </form>
  );
}

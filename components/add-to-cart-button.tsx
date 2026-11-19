"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Check, Plus } from "lucide-react";
import { motion } from "framer-motion";
import { useCart } from "@/lib/cart";
import { Button, type ButtonProps } from "@/components/ui/button";
import type { Product } from "@/data/products";

export function AddToCartButton({
  product,
  size,
  variant = "default",
  className,
}: { product: Product } & Pick<ButtonProps, "size" | "variant" | "className">) {
  const t = useTranslations("product");
  const { add } = useCart();
  const [done, setDone] = useState(false);

  function handle() {
    add(product);
    setDone(true);
    setTimeout(() => setDone(false), 1400);
  }

  return (
    <Button onClick={handle} size={size} variant={variant} className={className}>
      <motion.span
        key={done ? "done" : "idle"}
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="inline-flex items-center gap-2"
      >
        {done ? (
          <>
            <Check className="size-4" />
            {t("added")}
          </>
        ) : (
          <>
            <Plus className="size-4" />
            {t("addToCart")}
          </>
        )}
      </motion.span>
    </Button>
  );
}

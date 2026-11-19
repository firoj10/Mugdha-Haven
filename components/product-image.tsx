import Image from "next/image";
import type { Product } from "@/data/products";
import { cn } from "@/lib/utils";

// Shows the original product photo as-is; falls back to a tinted placeholder.
export function ProductImage({
  product,
  className,
  priority,
  sizes = "(max-width: 768px) 50vw, 25vw",
}: {
  product: Product;
  className?: string;
  priority?: boolean;
  sizes?: string;
}) {
  if (product.image) {
    return (
      <div className={cn("relative overflow-hidden", className)}>
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes={sizes}
          className="object-cover"
          priority={priority}
        />
      </div>
    );
  }

  return (
    <div
      className={cn("stage flex items-center justify-center", className)}
      aria-label={product.name}
      role="img"
    >
      <div className="stone-slab">
        <div className="body" />
        <div className="top" />
      </div>
      <span className="relative px-3 text-center text-xs font-semibold uppercase tracking-wider text-primary">
        {product.brand}
      </span>
    </div>
  );
}

import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Star } from "lucide-react";
import { getTranslations } from "next-intl/server";
import {
  getProductBySlug,
  getProducts,
  getRelatedProducts,
} from "@/lib/products";
import { Tilt } from "@/components/motion";
import { ProductImage } from "@/components/product-image";
import { ProductDescription } from "@/components/product-description";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { ProductCard } from "@/components/product-card";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const product = await getProductBySlug(params.slug);
  if (!product) return {};
  return { title: product.name, description: product.description_en };
}

export default async function ProductPage({
  params,
}: {
  params: { slug: string };
}) {
  const product = await getProductBySlug(params.slug);
  if (!product) notFound();

  const related = await getRelatedProducts(product);
  const t = await getTranslations("product");

  return (
    <div className="container py-12">
      <Link
        href="/shop"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-primary"
      >
        <ArrowLeft className="size-4" />
        {t("back")}
      </Link>

      <div className="mt-8 grid gap-10 lg:grid-cols-2">
        <Tilt className="aspect-square overflow-hidden rounded-3xl" max={8}>
          <ProductImage product={product} priority className="h-full w-full" />
        </Tilt>

        <div className="flex flex-col gap-5">
          <div className="space-y-2">
            <span className="text-sm uppercase tracking-wide text-muted-foreground">
              {product.brand}
            </span>
            <h1 className="font-serif text-3xl font-semibold sm:text-4xl">
              {product.name}
            </h1>
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1 text-sm">
                <Star className="size-4 fill-primary text-primary" />
                {product.rating}
              </span>
              <Badge variant="secondary">{product.category}</Badge>
            </div>
          </div>

          <div className="flex items-baseline gap-3">
            <span className="text-2xl font-semibold">
              {formatPrice(product.price)}
            </span>
            {product.compareAt && (
              <span className="text-muted-foreground line-through">
                {formatPrice(product.compareAt)}
              </span>
            )}
          </div>

          <ProductDescription product={product} />

          <AddToCartButton
            product={product}
            size="lg"
            className="mt-2 w-full sm:w-auto"
          />
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-20">
          <h2 className="font-serif text-2xl font-semibold">{t("related")}</h2>
          <div className="mt-8 grid grid-cols-2 gap-5 md:grid-cols-4">
            {related.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

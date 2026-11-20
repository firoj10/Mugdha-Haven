import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import { getCategories, getProducts } from "@/lib/products";
import { ShopGrid } from "@/components/shop-grid";

export async function generateMetadata() {
  const t = await getTranslations("shop");
  return { title: t("title") };
}

export default async function ShopPage() {
  const [products, categories] = await Promise.all([
    getProducts(),
    getCategories(),
  ]);
  const t = await getTranslations("shop");

  return (
    <div className="container py-16">
      <h1 className="font-serif text-4xl font-semibold tracking-wide">
        {t("title")}
      </h1>
      <p className="mt-2 text-muted-foreground">{t("subtitle")}</p>

      <div className="mt-10">
        {/* Suspense: ShopGrid reads search params on the client. */}
        <Suspense>
          <ShopGrid products={products} categories={categories} />
        </Suspense>
      </div>
    </div>
  );
}

import { getTranslations } from "next-intl/server";
import { getFeaturedProducts, getProducts } from "@/lib/products";
import { ProductCard } from "@/components/product-card";

export async function FeaturedProducts({
  variant = "favorite",
}: {
  variant?: "favorite" | "best";
}) {
  const t = await getTranslations("site");
  const all = await getProducts();
  const fav = variant === "favorite";
  const products = fav ? await getFeaturedProducts() : [...all].reverse();

  return (
    <section className={fav ? "bg-secondary/50" : ""}>
      <div className="container py-10 sm:py-14">
        <div className="mb-8 text-center">
          <h2
            className={`font-sans uppercase ${
              fav
                ? "text-2xl font-bold"
                : "text-xl font-black tracking-wide md:text-3xl"
            }`}
          >
            {fav ? t("favTitle") : t("bestTitle")}
          </h2>
          {fav && (
            <p className="mt-1 text-sm font-bold sm:text-[15px]">{t("favSubtitle")}</p>
          )}
        </div>
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {products.slice(0, fav ? 4 : 8).map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} size={fav ? "lg" : "sm"} />
          ))}
        </div>
      </div>
    </section>
  );
}

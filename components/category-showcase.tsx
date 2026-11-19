import Link from "next/link";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { getProducts } from "@/lib/products";

// Category strip: original product photo + dark label bar.
export async function CategoryShowcase() {
  const products = await getProducts();
  const t = await getTranslations("categories");
  const cats = [...new Set(products.map((p) => p.category))];

  return (
    <section className="container py-8 sm:py-12">
      <div className="mb-6 text-center">
        <h2 className="font-sans text-2xl font-bold uppercase">{t("title")}</h2>
        <p className="mt-1 text-sm font-medium text-foreground/70">{t("subtitle")}</p>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7">
        {cats.map((c) => {
          const p = products.find((x) => x.category === c && x.image);
          return (
            <Link
              key={c}
              href={`/shop?category=${encodeURIComponent(c)}`}
              className="group overflow-hidden rounded-2xl bg-topbar transition-transform hover:-translate-y-1"
            >
              <div className="relative aspect-[3/2.8] overflow-hidden bg-secondary">
                {p?.image && (
                  <Image
                    src={p.image}
                    alt={c}
                    fill
                    sizes="(max-width: 640px) 50vw, 14vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                )}
              </div>
              <div className="px-2 py-3 text-center text-sm font-semibold text-topbar-foreground">
                {c}
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

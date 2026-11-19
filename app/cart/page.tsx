import { getTranslations } from "next-intl/server";
import { CartView } from "@/components/cart-view";

export async function generateMetadata() {
  const t = await getTranslations("cart");
  return { title: t("title") };
}

export default async function CartPage() {
  const t = await getTranslations("cart");
  return (
    <div className="container py-16">
      <h1 className="font-serif text-3xl font-semibold sm:text-4xl">
        {t("title")}
      </h1>
      <div className="mt-10">
        <CartView />
      </div>
    </div>
  );
}

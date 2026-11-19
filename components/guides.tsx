import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { ArrowRight } from "lucide-react";

export async function Guides() {
  const t = await getTranslations("site");
  return (
    <section className="py-12 sm:py-14">
      <div className="container">
        <div className="mx-auto mb-4 text-center">
          <h2 className="mb-4 font-sans text-3xl font-bold sm:text-4xl lg:text-5xl">
            {t("guidesTitle")}
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground">
            {t("guidesText")}
          </p>
          <Link
            href="/about"
            className="mx-auto inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground transition-all duration-300 hover:scale-105 hover:bg-primary/90"
          >
            {t("guidesCta")}
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

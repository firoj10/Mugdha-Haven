import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { ArrowRight } from "lucide-react";

export async function Guides() {
  const t = await getTranslations("site");
  return (
    <section className="py-12 sm:py-14">
      <div className="container">
        <div className="mx-auto mb-4 text-center">
          <h2 className="mb-4 font-serif text-3xl font-semibold tracking-wide sm:text-4xl lg:text-5xl">
            {t("guidesTitle")}
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-base text-foreground/75">
            {t("guidesText")}
          </p>
          <Link
            href="/about"
            className="mx-auto inline-flex items-center gap-2 rounded-sm bg-cta px-8 py-3.5 text-xs font-bold uppercase tracking-[0.2em] text-cta-foreground transition-all duration-300 hover:bg-cta/85"
          >
            {t("guidesCta")}
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

import { Mail, Phone } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Reveal } from "@/components/motion";

export async function generateMetadata() {
  const t = await getTranslations("about");
  return { title: t("title") };
}

export default async function AboutPage() {
  const t = await getTranslations("about");

  return (
    <div className="container max-w-3xl py-20">
      <Reveal className="space-y-6">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
          Mugdha Haven
        </span>
        <h1 className="font-serif text-4xl font-semibold">{t("title")}</h1>
        <p className="text-lg text-muted-foreground">{t("lead")}</p>
        <p className="leading-relaxed text-muted-foreground">{t("body1")}</p>
        <p className="leading-relaxed text-muted-foreground">{t("body2")}</p>
      </Reveal>

      <Reveal className="mt-14 rounded-3xl border border-border/60 bg-card p-8">
        <h2 className="font-serif text-2xl font-semibold">
          {t("contactTitle")}
        </h2>
        <p className="mt-2 text-muted-foreground">{t("contactSubtitle")}</p>
        <div className="mt-6 flex flex-col gap-3 text-sm">
          <span className="inline-flex items-center gap-2">
            <Mail className="size-4 text-primary" /> hello@mugdhahaven.com
          </span>
          <span className="inline-flex items-center gap-2">
            <Phone className="size-4 text-primary" /> +880 1XXX-XXXXXX
          </span>
        </div>
      </Reveal>
    </div>
  );
}

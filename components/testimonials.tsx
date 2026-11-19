import { Star } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Reveal } from "@/components/motion";
import { SectionHeading } from "@/components/section-heading";

const AUTHORS = [
  { name: "Nusrat J.", q: "q1" },
  { name: "Tanvir A.", q: "q2" },
  { name: "Farhana K.", q: "q3" },
] as const;

export async function Testimonials() {
  const t = await getTranslations("testimonials");

  return (
    <section className="container py-20">
      <SectionHeading eyebrow={t("eyebrow")} title={t("title")} />
      <div className="mt-12 grid gap-5 md:grid-cols-3">
        {AUTHORS.map((a, i) => (
          <Reveal key={a.q} delay={(i % 3) * 0.1}>
            <figure className="flex h-full flex-col gap-4 rounded-2xl border border-border/60 bg-card p-6">
              <div className="flex gap-1 text-primary">
                {Array.from({ length: 5 }).map((_, s) => (
                  <Star key={s} className="size-4 fill-primary" />
                ))}
              </div>
              <blockquote className="flex-1 text-sm leading-relaxed text-muted-foreground">
                “{t(a.q)}”
              </blockquote>
              <figcaption className="text-sm font-semibold">{a.name}</figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

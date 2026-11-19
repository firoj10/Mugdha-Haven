import { Facebook, Instagram, Linkedin, Phone, Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";
import { LanguageSwitcher } from "@/components/language-switcher";

// Slim announcement strip: brand-colored, promo text in the middle,
// contact on the left, language + socials on the right.
export function TopBar() {
  const t = useTranslations("site");
  return (
    <div className="relative bg-topbar text-topbar-foreground">
      <div className="container flex h-10 items-center justify-between gap-4 text-xs">
        <a
          href="https://wa.me/8801000000000"
          className="hidden items-center gap-1.5 font-medium transition hover:text-secondary md:flex"
        >
          <Phone className="size-3.5" /> +880 1XXX-XXXXXX
        </a>

        <p className="mx-auto flex items-center gap-2 text-center font-medium tracking-wide">
          <Sparkles className="size-3.5 shrink-0 text-secondary" />
          <span className="line-clamp-1">{t("topbarShipping")}</span>
        </p>

        <div className="hidden items-center gap-4 md:flex">
          <LanguageSwitcher className="border-topbar-foreground/40 text-[11px] [&_button]:px-2.5 [&_button]:py-0.5 [&_button:not([aria-pressed=true])]:text-topbar-foreground [&_button[aria-pressed=true]]:bg-secondary [&_button[aria-pressed=true]]:text-secondary-foreground" />
          <span className="h-3.5 w-px bg-topbar-foreground/30" />
          <div className="flex items-center gap-3">
            {[Facebook, Instagram, Linkedin].map((Icon, i) => (
              <a key={i} href="#" className="transition hover:text-secondary">
                <Icon className="size-3.5" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

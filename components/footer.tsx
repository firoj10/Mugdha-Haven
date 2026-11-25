"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { Facebook, Instagram, Linkedin } from "lucide-react";
import { useCategories } from "@/lib/categories";

export function Footer() {
  const categories = useCategories();
  const t = useTranslations();
  const year = new Date().getFullYear();
  const head = "mb-4 font-sans text-lg font-semibold";
  const list = "space-y-2 text-sm text-footer-foreground/60";
  const a = "transition hover:text-secondary";
  const social =
    "flex size-9 items-center justify-center rounded-sm bg-footer-foreground/10 transition hover:bg-secondary/20 hover:text-secondary";

  return (
    <footer className="bg-footer text-footer-foreground">
      <div className="container py-14">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="mb-4 font-sans text-2xl font-bold">
              Mugdha <span className="text-secondary">Haven</span>
            </p>
            <p className="max-w-xs text-sm leading-relaxed text-footer-foreground/60">
              {t("footer.tagline")}
            </p>
          </div>

          <div>
            <h4 className={head}>{t("footer.categories")}</h4>
            <ul className={list}>
              {categories.map((c) => (
                <li key={c}>
                  <Link href={`/shop?category=${encodeURIComponent(c)}`} className={a}>
                    {c}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className={head}>{t("footer.links")}</h4>
            <ul className={list}>
              <li><Link href="/about" className={a}>{t("site.blog")}</Link></li>
              <li><Link href="/shop" className={a}>{t("site.stores")}</Link></li>
              <li><Link href="/about" className={a}>{t("site.contacts")}</Link></li>
              <li><Link href="/cart" className={a}>{t("site.delivery")}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className={head}>{t("site.subscribe")}</h4>
            <form className="mb-4 flex">
              <input
                type="email"
                placeholder={t("newsletter.placeholder")}
                className="h-10 w-full rounded-l-sm bg-footer-foreground/10 px-3 text-sm outline-none placeholder:text-footer-foreground/50"
              />
              <button
                type="submit"
                className="h-10 rounded-r-sm bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              >
                {t("newsletter.button")}
              </button>
            </form>
            <div className="flex gap-3">
              <a href="#" className={social}><Facebook className="size-4" /></a>
              <a href="#" className={social}><Instagram className="size-4" /></a>
              <a href="#" className={social}><Linkedin className="size-4" /></a>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-footer-foreground/10 pt-6 md:flex-row">
          <p className="text-center text-xs text-footer-foreground/50 md:text-left">
            © {year} Mugdha Haven | {t("footer.rights")}
          </p>
          <p className="text-xs text-footer-foreground/50">{t("footer.madeWith")}</p>
        </div>
      </div>
    </footer>
  );
}

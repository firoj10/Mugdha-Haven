"use client";

import { useEffect } from "react";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

const LOCALES = [
  { code: "en", label: "EN" },
  { code: "bn", label: "বাংলা" },
];

export function LanguageSwitcher({ className }: { className?: string }) {
  const locale = useLocale();
  const router = useRouter();

  function set(code: string) {
    if (code === locale) return;
    document.cookie = `locale=${code};path=/;max-age=31536000`;
    localStorage.setItem("locale", code);
    document.body.dataset.lang = code;
    router.refresh();
  }

  // localStorage wins if the cookie was cleared between visits.
  useEffect(() => {
    const saved = localStorage.getItem("locale");
    if (saved && saved !== locale) {
      document.cookie = `locale=${saved};path=/;max-age=31536000`;
      router.refresh();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-sm border border-primary/30 p-0.5 text-xs font-medium",
        className
      )}
    >
      {LOCALES.map((l) => (
        <button
          key={l.code}
          onClick={() => set(l.code)}
          aria-pressed={locale === l.code}
          className={cn(
            "rounded-sm px-3 py-1 transition",
            locale === l.code
              ? "bg-primary text-primary-foreground"
              : "text-foreground/70 hover:text-foreground"
          )}
        >
          {l.label}
        </button>
      ))}
    </div>
  );
}

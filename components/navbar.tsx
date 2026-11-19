"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { Flame, Heart, Menu, Search, ShoppingBag, User, X } from "lucide-react";
import { useCart } from "@/lib/cart";
import { useWishlist } from "@/lib/wishlist";
import { LanguageSwitcher } from "@/components/language-switcher";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/", key: "home" },
  { href: "/shop", key: "shop" },
  { href: "/about", key: "about" },
] as const;

const iconBtn =
  "relative flex size-10 items-center justify-center rounded-full text-topbar-foreground transition-colors hover:bg-topbar-foreground/15";
const badge =
  "absolute right-0 top-0 flex size-4 items-center justify-center rounded-full bg-secondary text-[9px] font-bold text-secondary-foreground";

export function Navbar() {
  const t = useTranslations("nav");
  const ts = useTranslations("site");
  const pathname = usePathname();
  const { count } = useCart();
  const wish = useWishlist();
  const [mounted, setMounted] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => setMounted(true), []);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 8);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  useEffect(() => {
    if (searchOpen) inputRef.current?.focus();
  }, [searchOpen]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-40 px-3 pt-3 sm:px-5">
      <div
        className={cn(
          "mx-auto flex h-16 max-w-[88rem] items-center gap-3 rounded-full border px-3 backdrop-blur-xl transition-all duration-300 sm:px-4",
          scrolled
            ? "border-topbar-foreground/20 bg-topbar shadow-xl shadow-foreground/30"
            : "border-topbar-foreground/15 bg-topbar shadow-md"
        )}
      >
        {/* Logo with monogram */}
        <Link href="/" aria-label="Mugdha Haven home" className="flex shrink-0 items-center gap-2.5">
          <span className="flex size-10 items-center justify-center rounded-full bg-secondary font-serif text-lg font-bold text-secondary-foreground">
            M
          </span>
          <span className="hidden flex-col leading-none sm:flex">
            <span className="font-sans text-base font-bold tracking-tight text-topbar-foreground">
              Mugdha <span className="text-secondary">Haven</span>
            </span>
            <span className="mt-1 text-[9px] uppercase tracking-[0.2em] text-topbar-foreground/70">
              {t("tagline")}
            </span>
          </span>
        </Link>

        {/* Center: links (or search when open) */}
        <div className="relative mx-auto hidden h-10 flex-1 items-center justify-center lg:flex">
          {searchOpen ? (
            <form action="/shop" className="flex w-full max-w-xl items-center gap-2 rounded-full bg-topbar-foreground/15 px-4">
              <Search className="size-4 text-topbar-foreground/80" />
              <input
                ref={inputRef}
                name="q"
                autoComplete="off"
                placeholder={ts("search")}
                className="h-10 w-full bg-transparent text-sm text-topbar-foreground outline-none placeholder:text-topbar-foreground/60"
                onKeyDown={(e) => e.key === "Escape" && setSearchOpen(false)}
              />
              <button type="button" aria-label="Close search" onClick={() => setSearchOpen(false)}>
                <X className="size-4 text-topbar-foreground/80 hover:text-topbar-foreground" />
              </button>
            </form>
          ) : (
            <nav className="flex items-center gap-1 rounded-full bg-topbar-foreground/10 p-1">
              {LINKS.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className={cn(
                    "rounded-full px-5 py-1.5 text-sm font-medium transition-all",
                    isActive(l.href)
                      ? "bg-secondary text-secondary-foreground shadow"
                      : "text-topbar-foreground hover:bg-topbar-foreground/15"
                  )}
                >
                  {t(l.key)}
                </Link>
              ))}
              <Link
                href="/shop"
                className="fusion-offer ml-1 flex items-center gap-1.5 rounded-full border border-secondary px-4 py-1.5 text-sm font-semibold text-secondary"
              >
                <Flame className="size-3.5" />
                {ts("bestBtn")}
              </Link>
            </nav>
          )}
        </div>

        {/* Right actions */}
        <div className="ml-auto flex items-center gap-1 lg:ml-0">
          <button
            aria-label="Search"
            onClick={() => setSearchOpen((v) => !v)}
            className={cn(iconBtn, "hidden lg:flex")}
          >
            <Search className="size-[18px]" />
          </button>
          <Link href="/shop" aria-label="Search" className={cn(iconBtn, "lg:hidden")}>
            <Search className="size-[18px]" />
          </Link>
          <button
            aria-label={ts("favorites")}
            title={ts("favorites")}
            onClick={() => wish.setOpen(true)}
            className={cn(iconBtn, "hidden sm:flex")}
          >
            <Heart className="size-[18px]" />
            {mounted && wish.count > 0 && <span className={badge}>{wish.count}</span>}
          </button>
          <Link href="/cart" aria-label={t("cart")} className={iconBtn}>
            <ShoppingBag className="size-[18px]" />
            {mounted && count > 0 && <span className={badge}>{count}</span>}
          </Link>

          <span className="mx-1 hidden h-6 w-px bg-topbar-foreground/25 lg:block" />
          <Link
            href="/cart"
            className="hidden items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium text-topbar-foreground transition hover:text-secondary lg:flex"
          >
            <User className="size-4" /> {ts("login")}
          </Link>
          <Link
            href="/cart"
            className="hidden rounded-full bg-secondary px-5 py-2 text-sm font-semibold text-secondary-foreground transition hover:bg-secondary/85 lg:block"
          >
            {ts("register")}
          </Link>

          {/* Mobile menu */}
          <Sheet>
            <SheetTrigger asChild>
              <button aria-label={t("openMenu")} className={cn(iconBtn, "lg:hidden")}>
                <Menu className="size-5" />
              </button>
            </SheetTrigger>
            <SheetContent>
              <SheetTitle className="font-sans text-lg font-bold">Mugdha Haven</SheetTitle>
              <div className="flex flex-col gap-1">
                {LINKS.map((l) => (
                  <SheetClose asChild key={l.href}>
                    <Link
                      href={l.href}
                      className={cn(
                        "rounded-full px-4 py-2.5 text-base font-medium transition-colors",
                        isActive(l.href)
                          ? "bg-cta text-cta-foreground"
                          : "hover:bg-secondary/60"
                      )}
                    >
                      {t(l.key)}
                    </Link>
                  </SheetClose>
                ))}
                <SheetClose asChild>
                  <Link
                    href="/shop"
                    className="fusion-offer mt-2 flex items-center gap-2 rounded-full bg-cta px-4 py-2.5 text-base font-semibold text-cta-foreground"
                  >
                    <Flame className="size-4" /> {ts("bestBtn")}
                  </Link>
                </SheetClose>
              </div>
              <div className="flex gap-2 pt-2">
                <Link href="/cart" className="flex-1 rounded-full border border-border py-2 text-center text-sm font-medium">
                  {ts("login")}
                </Link>
                <Link href="/cart" className="flex-1 rounded-full bg-cta py-2 text-center text-sm font-semibold text-cta-foreground">
                  {ts("register")}
                </Link>
              </div>
              <LanguageSwitcher />
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

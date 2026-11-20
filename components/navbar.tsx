"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { Flame, Heart, Menu, Search, ShoppingBag, X } from "lucide-react";
import { useCart } from "@/lib/cart";
import { useWishlist } from "@/lib/wishlist";
import { CategoryBar } from "@/components/category-bar";
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
  { href: "/shop", key: "shop" },
  { href: "/about", key: "about" },
] as const;

const iconBtn =
  "relative flex size-10 items-center justify-center text-topbar-foreground/90 transition-colors hover:text-highlight";
const badge =
  "absolute right-0.5 top-0.5 flex size-4 items-center justify-center bg-highlight text-[9px] font-bold text-highlight-foreground";
const navLink =
  "group relative py-2 text-[12px] font-semibold uppercase tracking-[0.2em] transition-colors";

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
    <>
      <header
        className={cn(
          "sticky top-0 z-40 border-b border-topbar-foreground/10 bg-topbar/95 backdrop-blur transition-shadow duration-300",
          scrolled && "shadow-lg shadow-foreground/25"
        )}
      >
        <div className="container flex h-[72px] items-center gap-8">
          {/* Logo: square monogram + serif wordmark */}
          <Link
            href="/"
            aria-label="Mugdha Haven home"
            className="flex shrink-0 items-center gap-3"
          >
            <span className="flex size-10 items-center justify-center rounded-sm border border-secondary font-serif text-xl font-semibold text-secondary">
              M
            </span>
            <span className="hidden flex-col leading-none sm:flex">
              <span className="font-serif text-2xl font-semibold tracking-wide text-topbar-foreground">
                Mugdha <span className="text-secondary">Haven</span>
              </span>
              <span className="mt-1.5 text-[9px] uppercase tracking-[0.3em] text-topbar-foreground/60">
                {t("tagline")}
              </span>
            </span>
          </Link>

          {/* Center: links (or search) */}
          <div className="mx-auto hidden h-10 flex-1 items-center justify-center lg:flex">
            {searchOpen ? (
              <form
                action="/shop"
                className="flex w-full max-w-xl items-center gap-3 border-b border-secondary"
              >
                <Search className="size-4 text-topbar-foreground/70" />
                <input
                  ref={inputRef}
                  name="q"
                  autoComplete="off"
                  placeholder={ts("search")}
                  className="h-10 w-full bg-transparent text-sm tracking-wide text-topbar-foreground outline-none placeholder:text-topbar-foreground/50"
                  onKeyDown={(e) => e.key === "Escape" && setSearchOpen(false)}
                />
                <button
                  type="button"
                  aria-label="Close search"
                  onClick={() => setSearchOpen(false)}
                >
                  <X className="size-4 text-topbar-foreground/70 hover:text-topbar-foreground" />
                </button>
              </form>
            ) : (
              <nav className="flex items-center gap-10">
                {LINKS.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    className={cn(
                      navLink,
                      isActive(l.href)
                        ? "text-topbar-foreground"
                        : "text-topbar-foreground/70 hover:text-topbar-foreground"
                    )}
                  >
                    {t(l.key)}
                    <span
                      className={cn(
                        "absolute inset-x-0 bottom-0 h-px origin-left bg-highlight transition-transform duration-300",
                        isActive(l.href)
                          ? "scale-x-100"
                          : "scale-x-0 group-hover:scale-x-100"
                      )}
                    />
                  </Link>
                ))}
                <Link
                  href="/shop"
                  className={cn(
                    navLink,
                    "flex items-center gap-1.5 text-highlight hover:text-highlight/80"
                  )}
                >
                  <Flame className="size-3.5" />
                  {ts("bestBtn")}
                  <span className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-highlight transition-transform duration-300 group-hover:scale-x-100" />
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

            <span className="mx-3 hidden h-6 w-px bg-topbar-foreground/20 lg:block" />
            <Link
              href="/cart"
              className="hidden px-2 text-[12px] font-semibold uppercase tracking-[0.2em] text-topbar-foreground/90 transition hover:text-highlight lg:block"
            >
              {ts("login")}
            </Link>
            <Link
              href="/cart"
              className="ml-2 hidden h-10 items-center rounded-sm bg-highlight px-6 text-[12px] font-bold uppercase tracking-[0.2em] text-highlight-foreground transition hover:bg-highlight/85 lg:flex"
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
                <SheetTitle className="font-serif text-2xl font-semibold tracking-wide">
                  Mugdha Haven
                </SheetTitle>
                <div className="flex flex-col">
                  {LINKS.map((l) => (
                    <SheetClose asChild key={l.href}>
                      <Link
                        href={l.href}
                        className={cn(
                          "border-b border-border py-3 text-[13px] font-semibold uppercase tracking-[0.2em] transition-colors",
                          isActive(l.href) ? "text-foreground" : "text-foreground/70"
                        )}
                      >
                        {t(l.key)}
                      </Link>
                    </SheetClose>
                  ))}
                  <SheetClose asChild>
                    <Link
                      href="/shop"
                      className="flex items-center gap-2 border-b border-border py-3 text-[13px] font-semibold uppercase tracking-[0.2em] text-highlight"
                    >
                      <Flame className="size-4" /> {ts("bestBtn")}
                    </Link>
                  </SheetClose>
                </div>
                <div className="flex gap-2">
                  <Link
                    href="/cart"
                    className="flex-1 rounded-sm border border-foreground py-2.5 text-center text-xs font-bold uppercase tracking-[0.2em]"
                  >
                    {ts("login")}
                  </Link>
                  <Link
                    href="/cart"
                    className="flex-1 rounded-sm bg-cta py-2.5 text-center text-xs font-bold uppercase tracking-[0.2em] text-cta-foreground"
                  >
                    {ts("register")}
                  </Link>
                </div>
                <LanguageSwitcher />
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
      <Suspense fallback={null}>
        <CategoryBar />
      </Suspense>
    </>
  );
}

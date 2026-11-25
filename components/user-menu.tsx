"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { ChevronDown, LayoutDashboard, Loader2, LogOut, UserCircle } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { cn } from "@/lib/utils";

export const initials = (name: string) =>
  name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]?.toUpperCase()).join("");

const item =
  "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition";

// Avatar button with the account menu. `dark` is for the dark storefront navbar.
export function UserMenu({ dark }: { dark?: boolean }) {
  const t = useTranslations("auth");
  const { user, roles, permissions, logout } = useAuth();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [error, setError] = useState("");
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (!open) return;
    const outside = (e: MouseEvent) => {
      if (!box.current?.contains(e.target as Node)) setOpen(false);
    };
    const escape = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", outside);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("mousedown", outside);
      document.removeEventListener("keydown", escape);
    };
  }, [open]);

  if (!user) return null;

  async function signOut() {
    setLeaving(true);
    setError("");
    try {
      await logout();
      // A full page load drops every bit of the previous user's data.
      window.location.assign("/login");
    } catch (err) {
      setError((err as Error).message);
      setLeaving(false);
    }
  }

  return (
    <div ref={box} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={t("account")}
        aria-haspopup="true"
        aria-expanded={open}
        className={cn(
          "flex items-center gap-2 rounded-full p-1 transition",
          dark ? "hover:bg-topbar-foreground/10" : "hover:bg-black/5"
        )}
      >
        <span
          className={cn(
            "flex size-9 items-center justify-center rounded-full text-xs font-bold ring-2",
            dark
              ? "bg-highlight text-highlight-foreground ring-topbar-foreground/20"
              : "bg-primary text-primary-foreground ring-primary/20"
          )}
        >
          {initials(user.name)}
        </span>
        <ChevronDown
          className={cn(
            "hidden size-4 transition-transform sm:block",
            dark ? "text-topbar-foreground/70" : "text-foreground/50",
            open && "rotate-180"
          )}
        />
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-64 rounded-2xl border border-black/10 bg-white p-2 text-foreground shadow-2xl animate-in fade-in-0 zoom-in-95">
          <div className="border-b border-black/5 px-3 pb-3 pt-1.5">
            <p className="truncate text-sm font-bold">{user.name}</p>
            <p className="truncate text-xs text-foreground/60">{user.email}</p>
            {roles.length > 0 && (
              <p className="mt-1 truncate text-xs font-semibold text-primary">{roles.join(", ")}</p>
            )}
          </div>
          <div className="pt-1.5">
            <Link href="/account" onClick={() => setOpen(false)} className={`${item} hover:bg-black/5`}>
              <UserCircle className="size-[18px]" /> {t("account")}
            </Link>
            {permissions.length > 0 && (
              <Link href="/admin" onClick={() => setOpen(false)} className={`${item} hover:bg-black/5`}>
                <LayoutDashboard className="size-[18px]" /> {t("admin")}
              </Link>
            )}
            <button type="button" onClick={signOut} disabled={leaving} className={`${item} text-red-600 hover:bg-red-50 disabled:opacity-60`}>
              {leaving ? <Loader2 className="size-[18px] animate-spin" /> : <LogOut className="size-[18px]" />}
              {t("logout")}
            </button>
            {error && <p role="alert" className="px-3 py-1 text-xs text-red-700">{error}</p>}
          </div>
        </div>
      )}
    </div>
  );
}

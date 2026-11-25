"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ChevronDown, ClipboardList, History, KeyRound, LayoutDashboard, Loader2, LogOut, Menu, Package,
  ShieldCheck, Store, UserCircle, UserCog, Users, X, type LucideIcon,
} from "lucide-react";
import { useAuth } from "@/lib/auth";
import { UserMenu } from "@/components/user-menu";
import { cn } from "@/lib/utils";

type Item = {
  href: string;
  label: string;
  icon: LucideIcon;
  permission?: string;
  staff?: boolean;
  group?: "access"; // shown inside the "User management" dropdown
  hidden?: boolean; // reached from the avatar menu, not the sidebar
};

// A menu entry appears only if the user holds its permission.
const NAV: Item[] = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard, staff: true },
  { href: "/admin/orders", label: "Orders", icon: ClipboardList, permission: "orders.view" },
  { href: "/admin/products", label: "Products", icon: Package, permission: "products.view" },
  { href: "/admin/users", label: "Staff & users", icon: Users, permission: "users.view", group: "access" },
  { href: "/admin/roles", label: "Roles", icon: ShieldCheck, permission: "roles.view", group: "access" },
  { href: "/admin/permissions", label: "Permissions", icon: KeyRound, permission: "roles.view", group: "access" },
  { href: "/admin/audit", label: "Audit log", icon: History, permission: "audit.view" },
  { href: "/account", label: "My profile", icon: UserCircle, hidden: true },
];

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const { ready, user, permissions, can, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [error, setError] = useState("");
  const [toggled, setToggled] = useState<boolean | null>(null);

  useEffect(() => {
    setOpen(false);
    setToggled(null);
  }, [pathname]);
  useEffect(() => {
    if (ready && !user && !leaving) router.replace("/login");
  }, [ready, user, leaving, router]);

  async function signOut() {
    setLeaving(true);
    setError("");
    try {
      await logout();
      // A full page load drops every bit of the previous user's data.
      window.location.assign("/login");
    } catch (err) {
      setError(`Logout failed: ${(err as Error).message}`);
      setLeaving(false);
    }
  }

  if (!ready || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center" role="status">
        <Loader2 className="size-8 animate-spin text-primary" />
        <span className="sr-only">Loading</span>
      </div>
    );
  }

  const allowed = (item: Item) =>
    item.permission ? can(item.permission) : item.staff ? permissions.length > 0 : true;
  const items = NAV.filter((i) => !i.hidden && allowed(i));
  const access = items.filter((i) => i.group === "access");
  const inAccess = access.some((i) => i.href === pathname);
  // Open by itself on its own pages; a click overrides that until you navigate.
  const accessOpen = toggled ?? inAccess;

  const link = ({ href, label, icon: Icon }: Item, nested?: boolean) => (
    <Link
      key={href}
      href={href}
      aria-current={href === pathname ? "page" : undefined}
      className={cn(
        "flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition",
        nested && "py-2",
        href === pathname
          ? "bg-highlight text-highlight-foreground shadow-lg"
          : "text-topbar-foreground/70 hover:bg-topbar-foreground/10 hover:text-topbar-foreground"
      )}
    >
      <Icon className="size-[18px]" /> {label}
    </Link>
  );  const current = NAV.find((i) => i.href === pathname);

  return (
    <div className="min-h-screen bg-[#f7f5f2] lg:pl-64">
      {open && (
        <button aria-label="Close menu" className="fixed inset-0 z-30 bg-black/50 lg:hidden" onClick={() => setOpen(false)} />
      )}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-topbar text-topbar-foreground transition-transform duration-300 lg:translate-x-0",
          open ? "translate-x-0" : "invisible -translate-x-full lg:visible"
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-topbar-foreground/10 px-5">
          <Link href="/" className="flex items-center gap-3">
            <span className="flex size-9 items-center justify-center rounded-xl bg-highlight font-serif text-lg font-bold text-highlight-foreground">M</span>
            <span className="font-serif text-xl font-semibold">Mugdha Haven</span>
          </Link>
          <button className="lg:hidden" aria-label="Close menu" onClick={() => setOpen(false)}>
            <X className="size-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {items.map((item) => {
            if (item.group !== "access") return link(item);
            // The whole group is drawn once, where its first entry sits.
            if (item !== access[0]) return null;
            return (
              <div key="access">
                <button
                  type="button"
                  onClick={() => setToggled(!accessOpen)}
                  aria-expanded={accessOpen}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition hover:bg-topbar-foreground/10",
                    inAccess ? "text-topbar-foreground" : "text-topbar-foreground/70"
                  )}
                >
                  <UserCog className="size-[18px]" />
                  <span className="flex-1 text-left">User management</span>
                  <ChevronDown className={cn("size-4 transition-transform", accessOpen && "rotate-180")} />
                </button>
                {accessOpen && (
                  <div className="ml-5 mt-1 space-y-1 border-l border-topbar-foreground/15 pl-3">
                    {access.map((i) => link(i, true))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        <div className="space-y-1 border-t border-topbar-foreground/10 p-3">
          <Link href="/" className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm text-topbar-foreground/70 hover:bg-topbar-foreground/10">
            <Store className="size-[18px]" /> View store
          </Link>
          <button
            onClick={signOut}
            disabled={leaving}
            className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-red-300 hover:bg-red-500/15 disabled:opacity-60"
          >
            {leaving ? <Loader2 className="size-[18px] animate-spin" /> : <LogOut className="size-[18px]" />}
            Logout
          </button>
        </div>
      </aside>

      <header className="sticky top-0 z-20 flex h-16 items-center justify-between gap-4 border-b border-black/5 bg-white/85 px-4 backdrop-blur sm:px-8">
        <div className="flex items-center gap-3">
          <button className="lg:hidden" aria-label="Open menu" onClick={() => setOpen(true)}>
            <Menu className="size-6" />
          </button>
          <p className="text-sm font-semibold">{current?.label ?? "Dashboard"}</p>
        </div>
        <UserMenu />
      </header>

      <div className="mx-auto max-w-6xl p-4 sm:p-8">
        {error && <p role="alert" className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
        {current && !allowed(current) ? (
          <div className="rounded-2xl border border-black/5 bg-white p-12 text-center">
            <ShieldCheck className="mx-auto size-10 text-primary" />
            <p className="mt-4 text-lg font-semibold">You do not have access to this page.</p>
            <Link href="/account" className="mt-3 inline-block text-sm font-semibold text-primary underline">
              Go to my profile
            </Link>
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  );
}

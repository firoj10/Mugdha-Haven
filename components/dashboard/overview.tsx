"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AlertTriangle, Banknote, ClipboardList, Clock, Package, Users, type LucideIcon } from "lucide-react";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { formatPrice } from "@/lib/utils";
import { Alert, Empty, PageHeader, Pill, STATUS_TONE, panel } from "@/components/dashboard/ui";

type Stats = {
  orders?: { total: number; pending: number; revenue: number };
  products?: { total: number; lowStock: number };
  users?: { total: number };
  recentOrders?: { orderNo: string; customerName: string; status: string; total: number }[];
};

export function OverviewView() {
  const { user } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api<{ data: Stats }>("/admin/stats")
      .then((r) => setStats(r.data))
      .catch((e) => setError(e.message));
  }, []);

  const cards: { label: string; value: React.ReactNode; icon: LucideIcon; href: string }[] = [];
  if (stats?.orders) {
    cards.push(
      { label: "Delivered revenue", value: formatPrice(stats.orders.revenue), icon: Banknote, href: "/admin/orders" },
      { label: "Total orders", value: stats.orders.total, icon: ClipboardList, href: "/admin/orders" },
      { label: "Pending orders", value: stats.orders.pending, icon: Clock, href: "/admin/orders" }
    );
  }
  if (stats?.products) {
    cards.push(
      { label: "Products", value: stats.products.total, icon: Package, href: "/admin/products" },
      { label: "Low stock (5 or less)", value: stats.products.lowStock, icon: AlertTriangle, href: "/admin/products" }
    );
  }
  if (stats?.users) {
    cards.push({ label: "Users", value: stats.users.total, icon: Users, href: "/admin/users" });
  }

  return (
    <>
      <PageHeader title={`Welcome, ${user?.name ?? ""}`} text="Here is what is happening in your store." />
      <Alert error={error} />
      {!stats && !error && <Empty loading>{null}</Empty>}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map(({ label, value, icon: Icon, href }) => (
          <Link key={label} href={href} className={`${panel} group flex items-center justify-between p-5 transition hover:-translate-y-0.5 hover:shadow-lg`}>
            <div>
              <p className="text-sm text-foreground/60">{label}</p>
              <p className="mt-2 text-3xl font-bold tracking-tight">{value}</p>
            </div>
            <span className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary transition group-hover:bg-primary group-hover:text-primary-foreground">
              <Icon className="size-5" />
            </span>
          </Link>
        ))}
      </div>

      {stats?.recentOrders && (
        <section className={`${panel} mt-6 overflow-hidden`}>
          <div className="flex items-center justify-between border-b border-black/5 px-5 py-4">
            <h2 className="font-semibold">Recent orders</h2>
            <Link href="/admin/orders" className="text-sm font-semibold text-primary hover:underline">View all</Link>
          </div>
          {!stats.recentOrders.length && <Empty loading={false}>No orders yet.</Empty>}
          <ul className="divide-y divide-black/5">
            {stats.recentOrders.map((o) => (
              <li key={o.orderNo} className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 text-sm">
                <span className="font-semibold">{o.orderNo}</span>
                <span className="flex-1 text-foreground/60">{o.customerName}</span>
                <Pill tone={STATUS_TONE[o.status]}>{o.status}</Pill>
                <span className="font-semibold">{formatPrice(o.total)}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  );
}

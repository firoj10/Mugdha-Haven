"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { cn, formatPrice } from "@/lib/utils";
import {
  Alert, Btn, ConfirmModal, Empty, Modal, PageHeader, Pill, STATUS_TONE, Toast,
  panel, useAdminData, type Confirm,
} from "@/components/dashboard/ui";

type Order = {
  orderNo: string;
  status: string;
  customerName: string;
  phone: string;
  address: string;
  city: string;
  note?: string;
  total: number;
  createdAt: string;
  items: { productId: string; name: string; qty: number; unitPrice: number }[];
};

const NEXT: Record<string, string[]> = {
  pending: ["confirmed", "cancelled"],
  confirmed: ["shipped", "cancelled"],
  shipped: ["delivered", "cancelled"],
};
const FILTERS = ["all", "pending", "confirmed", "shipped", "delivered", "cancelled"];
const ACTION: Record<string, string> = {
  confirmed: "Confirm", shipped: "Ship", delivered: "Deliver", cancelled: "Cancel order",
};

export function OrdersView() {
  const { can } = useAuth();
  const [status, setStatus] = useState("all");
  const orders = useAdminData<Order>(`/admin/orders?limit=100${status === "all" ? "" : `&status=${status}`}`);
  const [details, setDetails] = useState<Order | null>(null);
  const [confirm, setConfirm] = useState<Confirm | null>(null);

  const update = (o: Order, next: string) =>
    orders.run(`/admin/orders/${o.orderNo}`, "PATCH", { status: next }, `Order marked ${next}`);

  return (
    <>
      <PageHeader title="Orders" text="Follow each order from payment to delivery." />
      <Alert error={orders.error} />

      <div className="mb-4 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setStatus(f)}
            aria-pressed={status === f}
            className={cn(
              "rounded-full px-4 py-1.5 text-sm font-semibold capitalize transition",
              status === f ? "bg-cta text-cta-foreground" : "bg-white text-foreground/70 ring-1 ring-black/10 hover:bg-black/5"
            )}
          >
            {f}
          </button>
        ))}
      </div>

      <section className={`${panel} divide-y divide-black/5`}>
        {!orders.data.length && <Empty loading={orders.loading}>No orders found.</Empty>}
        {orders.data.map((o) => (
          <div key={o.orderNo} className="flex flex-wrap items-center gap-4 p-4">
            <div className="min-w-48 flex-1">
              <p className="text-sm font-semibold">{o.orderNo}</p>
              <p className="text-xs text-foreground/60">
                {o.customerName} · {o.phone} · {new Date(o.createdAt).toLocaleDateString()}
              </p>
            </div>
            <Pill tone={STATUS_TONE[o.status]}>{o.status}</Pill>
            <span className="font-semibold">{formatPrice(o.total)}</span>
            <div className="flex flex-wrap gap-2">
              <Btn small variant="outline" onClick={() => setDetails(o)}>Details</Btn>
              {(NEXT[o.status] ?? [])
                .filter((s) => can(s === "cancelled" ? "orders.cancel" : "orders.update_status"))
                .map((next) => (
                  <Btn
                    key={next}
                    small
                    variant={next === "cancelled" ? "danger" : "primary"}
                    disabled={orders.busy}
                    onClick={() =>
                      next === "cancelled"
                        ? setConfirm({
                            title: "Cancel order?",
                            text: `${o.orderNo} will be cancelled and stock restored. This cannot be undone.`,
                            action: "Cancel order",
                            danger: true,
                            run: () => update(o, next),
                          })
                        : update(o, next)
                    }
                  >
                    {ACTION[next]}
                  </Btn>
                ))}
            </div>
          </div>
        ))}
      </section>

      {details && (
        <Modal title={details.orderNo} text={new Date(details.createdAt).toLocaleString()} onClose={() => setDetails(null)}>
          <p className="text-sm font-semibold">{details.customerName} · {details.phone}</p>
          <p className="text-sm text-foreground/60">{details.address}, {details.city}</p>
          {details.note && <p className="mt-2 rounded-xl bg-amber-50 p-3 text-sm">{details.note}</p>}
          <ul className="mt-4 divide-y divide-black/5 border-t border-black/5">
            {details.items.map((i) => (
              <li key={i.productId} className="flex justify-between gap-4 py-2.5 text-sm">
                <span>{i.name} × {i.qty}</span>
                <span className="font-semibold">{formatPrice(i.unitPrice * i.qty)}</span>
              </li>
            ))}
          </ul>
          <p className="flex justify-between border-t border-black/10 pt-3 font-bold">
            <span>Total</span>
            <span>{formatPrice(details.total)}</span>
          </p>
        </Modal>
      )}

      <ConfirmModal confirm={confirm} onClose={() => setConfirm(null)} />
      <Toast message={orders.message} onDone={orders.clearMessage} />
    </>
  );
}

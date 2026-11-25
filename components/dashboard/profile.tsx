"use client";

import { useCallback, useState } from "react";
import { Monitor } from "lucide-react";
import { api } from "@/lib/api";
import { useAuth, type Profile } from "@/lib/auth";
import { formatPrice } from "@/lib/utils";
import { initials } from "@/components/user-menu";
import {
  Alert, Btn, ConfirmModal, Empty, Modal, PageHeader, Pill, STATUS_TONE, Toast,
  field, panel, useAdminData, type Confirm,
} from "@/components/dashboard/ui";

type Session = { id: number; ip: string; userAgent: string; lastSeenAt: string; current: boolean };
type Order = { orderNo: string; status: string; total: number; createdAt: string };

function device(agent: string) {
  const browser = /Edg\//.test(agent) ? "Edge" : /Chrome\//.test(agent) ? "Chrome" : /Firefox\//.test(agent) ? "Firefox" : /Safari\//.test(agent) ? "Safari" : "Unknown browser";
  const os = /Android/.test(agent) ? "Android" : /iPhone|iPad/.test(agent) ? "iOS" : /Windows/.test(agent) ? "Windows" : /Mac OS/.test(agent) ? "macOS" : /Linux/.test(agent) ? "Linux" : "";
  return os ? `${browser} on ${os}` : browser;
}

export function ProfileView() {
  const { user, roles, permissions, apply } = useAuth();
  const sessions = useAdminData<Session>("/auth/sessions");
  const orders = useAdminData<Order>("/me/orders");
  const [modal, setModal] = useState<"name" | "password" | null>(null);
  const [confirm, setConfirm] = useState<Confirm | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const done = useCallback(() => setMessage(""), []);

  if (!user) return null;

  const open = (next: "name" | "password") => {
    setError("");
    setModal(next);
  };

  // Both forms get a fresh profile back from the API.
  async function submit(e: React.FormEvent<HTMLFormElement>, path: string, method: string, success: string) {
    e.preventDefault();
    const values = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    if ("repeat" in values) {
      if (values.repeat !== values.newPassword) return setError("The new passwords do not match");
      delete values.repeat;
    }
    setBusy(true);
    setError("");
    try {
      apply(await api<Profile>(path, { method, body: values }));
      setModal(null);
      setMessage(success);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <PageHeader title="My profile" text="Your details, security and orders." />

      <section className={`${panel} overflow-hidden`}>
        <div className="h-24 bg-gradient-to-r from-topbar via-primary to-highlight" />
        <div className="flex flex-wrap items-end justify-between gap-4 px-6 pb-6">
          <div className="flex flex-wrap items-end gap-4">
            <span className="-mt-10 flex size-20 items-center justify-center rounded-2xl border-4 border-white bg-topbar font-serif text-2xl font-bold text-topbar-foreground shadow-lg">
              {initials(user.name)}
            </span>
            <div className="pt-3">
              <p className="text-xl font-bold">{user.name}</p>
              <p className="text-sm text-foreground/60">{user.email}</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {(roles.length ? roles : ["customer"]).map((r) => (
                  <Pill key={r} tone="blue">{r}</Pill>
                ))}
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Btn variant="outline" onClick={() => open("name")}>Edit profile</Btn>
            <Btn onClick={() => open("password")}>Change password</Btn>
          </div>
        </div>
      </section>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <section className={`${panel} p-5`}>
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-semibold">Logged-in devices</h2>
            <Btn
              small
              variant="outline"
              onClick={() =>
                setConfirm({
                  title: "Logout from all devices?",
                  text: "Every session, including this one, will end.",
                  action: "Logout everywhere",
                  danger: true,
                  run: async () => {
                    if (await sessions.run("/auth/logout-all", "POST")) window.location.assign("/login");
                  },
                })
              }
            >
              Logout everywhere
            </Btn>
          </div>
          <div className="mt-3"><Alert error={sessions.error} /></div>
          <ul className="divide-y divide-black/5">
            {sessions.data.map((s) => (
              <li key={s.id} className="flex items-center gap-3 py-3">
                <Monitor className="size-5 shrink-0 text-primary" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">{device(s.userAgent)}</p>
                  <p className="truncate text-xs text-foreground/50">
                    {s.ip} · {new Date(s.lastSeenAt).toLocaleString()}
                  </p>
                </div>
                {s.current ? (
                  <Pill tone="green">This device</Pill>
                ) : (
                  <Btn small variant="outline" onClick={() => sessions.run(`/auth/sessions/${s.id}`, "DELETE", undefined, "Device logged out")}>
                    Logout
                  </Btn>
                )}
              </li>
            ))}
          </ul>
        </section>

        <section className={`${panel} p-5`}>
          <h2 className="font-semibold">My orders</h2>
          {!orders.data.length && <Empty loading={orders.loading}>No orders yet.</Empty>}
          <ul className="mt-2 divide-y divide-black/5">
            {orders.data.map((o) => (
              <li key={o.orderNo} className="flex flex-wrap items-center justify-between gap-2 py-3 text-sm">
                <span>
                  <span className="block font-semibold">{o.orderNo}</span>
                  <span className="text-xs text-foreground/50">{new Date(o.createdAt).toLocaleDateString()}</span>
                </span>
                <Pill tone={STATUS_TONE[o.status]}>{o.status}</Pill>
                <span className="font-semibold">{formatPrice(o.total)}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      {permissions.length > 0 && (
        <section className={`${panel} mt-6 p-5`}>
          <h2 className="font-semibold">My permissions ({permissions.length})</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {permissions.map((p) => <Pill key={p}>{p}</Pill>)}
          </div>
        </section>
      )}

      {modal === "name" && (
        <Modal title="Edit profile" text="Your email cannot be changed here." onClose={() => setModal(null)}>
          <Alert error={error} />
          <form method="post" onSubmit={(e) => submit(e, "/auth/me", "PATCH", "Profile updated")} className="space-y-4">
            <label className="block text-sm font-medium">
              Name
              <input name="name" required minLength={2} defaultValue={user.name} className={`${field} mt-1.5`} />
            </label>
            <div className="flex justify-end gap-3">
              <Btn variant="outline" onClick={() => setModal(null)}>Cancel</Btn>
              <Btn type="submit" busy={busy}>Save</Btn>
            </div>
          </form>
        </Modal>
      )}

      {modal === "password" && (
        <Modal title="Change password" text="All your other devices will be logged out." onClose={() => setModal(null)}>
          <Alert error={error} />
          <form method="post" onSubmit={(e) => submit(e, "/auth/password", "PUT", "Password changed")} className="space-y-4">
            {[
              ["currentPassword", "Current password", "current-password"],
              ["newPassword", "New password (10+ characters)", "new-password"],
              ["repeat", "Repeat new password", "new-password"],
            ].map(([name, label, auto]) => (
              <label key={name} className="block text-sm font-medium">
                {label}
                <input
                  name={name}
                  type="password"
                  required
                  minLength={name === "currentPassword" ? undefined : 10}
                  autoComplete={auto}
                  className={`${field} mt-1.5`}
                />
              </label>
            ))}
            <div className="flex justify-end gap-3">
              <Btn variant="outline" onClick={() => setModal(null)}>Cancel</Btn>
              <Btn type="submit" busy={busy}>Change password</Btn>
            </div>
          </form>
        </Modal>
      )}

      <ConfirmModal confirm={confirm} onClose={() => setConfirm(null)} />
      <Toast message={message || sessions.message} onDone={message ? done : sessions.clearMessage} />
    </>
  );
}

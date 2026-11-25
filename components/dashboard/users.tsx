"use client";

import { useEffect, useState } from "react";
import { KeyRound, LockOpen, LogOut, Pencil, Plus, Search, Trash2, UserCheck, UserX } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { initials } from "@/components/user-menu";
import {
  Alert, Btn, Checks, ConfirmModal, Empty, IconBtn, Modal, PageHeader, Pill, Toast,
  field, panel, useAdminData, type Confirm,
} from "@/components/dashboard/ui";

type User = {
  id: number;
  name: string;
  email: string;
  status: string;
  locked: boolean;
  createdAt: string;
  roles: { id: number; name: string }[];
};
type Role = { id: number; name: string; description: string; permissions: string[] };
type Open = { type: "create" } | { type: "edit" | "password"; user: User } | null;

const TABS = [
  { key: "true", label: "Staff" },
  { key: "false", label: "Customers" },
  { key: "", label: "All" },
];
const PAGE_SIZE = 20;

export function UsersView() {
  const { can, user: me, permissions: mine, roles: myRoles } = useAuth();
  const [tab, setTab] = useState("true");
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [q, setQ] = useState("");
  useEffect(() => {
    const id = setTimeout(() => {
      setQ(search.trim());
      setPage(1);
    }, 300);
    return () => clearTimeout(id);
  }, [search]);

  const query = new URLSearchParams({ limit: String(PAGE_SIZE), page: String(page) });
  if (tab) query.set("staff", tab);
  if (q) query.set("q", q);
  const users = useAdminData<User>(`/admin/users?${query}`);
  const roles = useAdminData<Role>(can("roles.view") ? "/admin/roles" : null);
  const [open, setOpen] = useState<Open>(null);
  const [selected, setSelected] = useState<string[]>([]);
  const [confirm, setConfirm] = useState<Confirm | null>(null);

  const totalPages = users.meta?.totalPages ?? 1;
  // Deleting the last row of the last page must not leave an empty screen.
  useEffect(() => {
    if (users.meta && page > Math.max(1, totalPages)) setPage(Math.max(1, totalPages));
  }, [users.meta, page, totalPages]);

  const isSuper = myRoles.includes("super_admin");
  // Roles you may not hand out are shown but locked (the API refuses them too).
  const options = roles.data.map((r) => ({
    value: String(r.id),
    label: r.name,
    hint: r.description || `${r.permissions.length} permissions`,
    disabled: !isSuper && (r.name === "super_admin" || r.permissions.some((p) => !mine.includes(p))),
  }));

  const editingSelf = open?.type === "edit" && open.user.id === me?.id;
  const canAssign = can("users.assign_roles") && can("roles.view") && !editingSelf;
  const canDetails = open?.type === "create" || can("users.update");

  function show(next: Open) {
    users.clearError();
    setSelected(next?.type === "edit" ? next.user.roles.map((r) => String(r.id)) : []);
    setOpen(next);
  }

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!open) return;
    const values = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    const roleIds = selected.map(Number);

    if (open.type === "create") {
      if (await users.run("/admin/users", "POST", { ...values, roleIds }, "Account created")) setOpen(null);
      return;
    }
    const base = `/admin/users/${open.user.id}`;
    if (open.type === "password") {
      if (await users.run(`${base}/password`, "PUT", values, "Password reset")) setOpen(null);
      return;
    }
    // Edit: send only what changed, details first and then roles.
    const changes: Record<string, string> = {};
    if (values.name && values.name !== open.user.name) changes.name = values.name;
    if (values.email && values.email !== open.user.email) changes.email = values.email;
    if (Object.keys(changes).length && !(await users.run(base, "PATCH", changes, "Account updated"))) return;
    const before = open.user.roles.map((r) => r.id).sort().join();
    if (canAssign && [...roleIds].sort().join() !== before) {
      if (!(await users.run(`${base}/roles`, "PUT", { roleIds }, "Roles updated"))) return;
    }
    setOpen(null);
  }

  function toggleStatus(u: User) {
    const disable = u.status === "active";
    setConfirm({
      title: disable ? "Disable account?" : "Enable account?",
      text: disable ? `${u.email} will be logged out and cannot log in.` : `${u.email} will be able to log in again.`,
      action: disable ? "Disable" : "Enable",
      danger: disable,
      run: () => users.run(`/admin/users/${u.id}`, "PATCH", { status: disable ? "disabled" : "active" }, disable ? "Account disabled" : "Account enabled"),
    });
  }

  return (
    <>
      <PageHeader title="Staff & users" text="Create accounts, assign roles and control access.">
        {can("users.create") && (
          <Btn onClick={() => show({ type: "create" })}>
            <Plus className="size-4" /> Add account
          </Btn>
        )}
      </PageHeader>
      {!open && <Alert error={users.error} />}

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex rounded-xl bg-white p-1 ring-1 ring-black/10">
          {TABS.map((t) => (
            <button
              key={t.label}
              onClick={() => {
                setTab(t.key);
                setPage(1);
              }}
              aria-pressed={tab === t.key}
              className={cn(
                "rounded-lg px-4 py-1.5 text-sm font-semibold transition",
                tab === t.key ? "bg-cta text-cta-foreground" : "text-foreground/60 hover:text-foreground"
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div className="relative w-full max-w-xs">
          <Search className="absolute left-3.5 top-3.5 size-4 text-foreground/40" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Name or email starts with…"
            aria-label="Search users"
            className={`${field} pl-10`}
          />
        </div>
      </div>

      <section className={`${panel} overflow-x-auto`}>
        {!users.data.length && <Empty loading={users.loading}>No accounts found.</Empty>}
        {users.data.length > 0 && (
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-black/5 text-xs uppercase tracking-wider text-foreground/50">
              <tr>
                <th className="px-4 py-3 font-semibold">Account</th>
                <th className="px-4 py-3 font-semibold">Roles</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {users.data.map((u) => {
                const self = u.id === me?.id;
                return (
                  <tr key={u.id} data-user={u.email} className="hover:bg-black/[0.02]">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                          {initials(u.name)}
                        </span>
                        <div>
                          <p className="font-semibold">
                            {u.name} {self && <span className="text-xs font-normal text-foreground/50">(you)</span>}
                          </p>
                          <p className="text-xs text-foreground/60">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {u.roles.length
                          ? u.roles.map((r) => <Pill key={r.id} tone="blue">{r.name}</Pill>)
                          : <Pill>customer</Pill>}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <Pill tone={u.status === "active" ? "green" : "red"}>{u.status}</Pill>
                        {u.locked && <Pill tone="amber">locked</Pill>}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        {(can("users.update") || (!self && can("users.assign_roles") && can("roles.view"))) && (
                          <IconBtn label="Edit" icon={Pencil} onClick={() => show({ type: "edit", user: u })} />
                        )}
                        {!self && can("users.reset_password") && (
                          <IconBtn label="Reset password" icon={KeyRound} onClick={() => show({ type: "password", user: u })} />
                        )}
                        {can("users.update") && u.locked && (
                          <IconBtn label="Unlock" icon={LockOpen} onClick={() => users.run(`/admin/users/${u.id}/unlock`, "POST", undefined, "Account unlocked")} />
                        )}
                        {!self && can("users.sessions") && (
                          <IconBtn
                            label="Force logout"
                            icon={LogOut}
                            onClick={() =>
                              setConfirm({
                                title: "Force logout?",
                                text: `${u.email} will be logged out on every device.`,
                                action: "Force logout",
                                danger: true,
                                run: () => users.run(`/admin/users/${u.id}/sessions`, "DELETE", undefined, "User logged out"),
                              })
                            }
                          />
                        )}
                        {!self && can("users.update") && (
                          <IconBtn
                            label={u.status === "active" ? "Disable" : "Enable"}
                            icon={u.status === "active" ? UserX : UserCheck}
                            onClick={() => toggleStatus(u)}
                          />
                        )}
                        {!self && can("users.delete") && (
                          <IconBtn
                            label="Delete"
                            icon={Trash2}
                            danger
                            onClick={() =>
                              setConfirm({
                                title: "Delete account permanently?",
                                text: `${u.email} will be removed. Their orders are kept. This cannot be undone.`,
                                action: "Delete account",
                                danger: true,
                                run: () => users.run(`/admin/users/${u.id}`, "DELETE", undefined, "Account deleted"),
                              })
                            }
                          />
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </section>

      <div className="mt-3 flex items-center justify-between text-sm text-foreground/60">
        <span>{users.meta?.total ?? 0} account(s)</span>
        {totalPages > 1 && (
          <div className="flex items-center gap-2">
            <Btn small variant="outline" disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</Btn>
            <span>Page {page} of {totalPages}</span>
            <Btn small variant="outline" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>Next</Btn>
          </div>
        )}
      </div>

      {open && (
        <Modal
          wide={open.type !== "password"}
          title={open.type === "create" ? "Add account" : open.type === "edit" ? "Edit account" : "Reset password"}
          text={open.type === "create" ? "Choose roles for staff. Leave them empty for a customer." : open.user.email}
          onClose={() => setOpen(null)}
        >
          <Alert error={users.error} />
          <form onSubmit={submit} method="post" autoComplete="off" className="space-y-5">
            {open.type !== "password" && (
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-sm font-medium">
                  Full name
                  <input name="name" required minLength={2} disabled={!canDetails} defaultValue={open.type === "edit" ? open.user.name : ""} className={`${field} mt-1.5`} />
                </label>
                <label className="block text-sm font-medium">
                  Email
                  <input name="email" type="email" required disabled={!canDetails || editingSelf} defaultValue={open.type === "edit" ? open.user.email : ""} className={`${field} mt-1.5`} />
                </label>
              </div>
            )}
            {open.type !== "edit" && (
              <label className="block text-sm font-medium">
                {open.type === "create" ? "Password" : "New password"}
                <input name="password" type="password" required minLength={10} autoComplete="new-password" placeholder="At least 10 characters" className={`${field} mt-1.5`} />
              </label>
            )}
            {open.type !== "password" && canAssign && (
              <fieldset>
                <legend className="mb-2 text-sm font-medium">Roles</legend>
                <Checks options={options} selected={selected} onChange={setSelected} />
              </fieldset>
            )}
            {editingSelf && (
              <p className="text-xs text-foreground/60">You cannot change your own email or roles.</p>
            )}
            <div className="flex justify-end gap-3">
              <Btn variant="outline" onClick={() => setOpen(null)}>Cancel</Btn>
              <Btn type="submit" busy={users.busy}>
                {open.type === "create" ? "Create account" : open.type === "edit" ? "Save changes" : "Reset password"}
              </Btn>
            </div>
          </form>
        </Modal>
      )}

      <ConfirmModal confirm={confirm} onClose={() => setConfirm(null)} />
      <Toast message={users.message} onDone={users.clearMessage} />
    </>
  );
}

"use client";

import { useState } from "react";
import { Copy, Eye, Lock, Pencil, Plus, Search, ShieldCheck, Trash2 } from "lucide-react";
import { useAuth } from "@/lib/auth";
import {
  Alert, Btn, Checks, ConfirmModal, Empty, IconBtn, Modal, PageHeader, Pill, Toast,
  field, panel, useAdminData, type Confirm,
} from "@/components/dashboard/ui";
import { groupPermissions, type Permission } from "@/components/dashboard/permission-groups";

type Role = {
  id: number;
  name: string;
  description: string;
  system: boolean;
  users: number;
  permissions: string[];
};
type Draft = {
  id: number | null;
  name: string;
  description: string;
  permissions: string[];
  readOnly?: boolean;
};

export function RolesView() {
  const { can, permissions: mine, roles: myRoles, refresh } = useAuth();
  const roles = useAdminData<Role>("/admin/roles");
  const permissions = useAdminData<Permission>("/admin/permissions");
  const [draft, setDraft] = useState<Draft | null>(null);
  const [confirm, setConfirm] = useState<Confirm | null>(null);
  const [search, setSearch] = useState("");

  const isSuper = myRoles.includes("super_admin");
  const holds = (key: string) => isSuper || mine.includes(key);
  // You may only change a role if you hold everything it grants.
  const editable = (r: Role) => can("roles.manage") && !r.system && r.permissions.every(holds);

  const term = search.trim().toLowerCase();
  const list = roles.data.filter((r) => `${r.name} ${r.description}`.toLowerCase().includes(term));
  const groups = groupPermissions(permissions.data);

  function edit(next: Draft) {
    roles.clearError();
    setDraft(next);
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!draft || draft.readOnly) return;
    const ok = await roles.run(
      draft.id ? `/admin/roles/${draft.id}` : "/admin/roles",
      draft.id ? "PATCH" : "POST",
      { name: draft.name, description: draft.description, permissions: draft.permissions },
      draft.id ? "Role updated" : "Role created"
    );
    if (ok) {
      setDraft(null);
      permissions.reload();
      refresh();
    }
  }

  return (
    <>
      <PageHeader title="Roles" text="A role is a set of permissions. Changes apply immediately.">
        {can("roles.manage") && (
          <Btn onClick={() => edit({ id: null, name: "", description: "", permissions: [] })}>
            <Plus className="size-4" /> Create role
          </Btn>
        )}
      </PageHeader>
      {!draft && <Alert error={roles.error} />}

      <div className="relative mb-4 max-w-xs">
        <Search className="absolute left-3.5 top-3.5 size-4 text-foreground/40" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search roles" aria-label="Search roles" className={`${field} pl-10`} />
      </div>

      {!list.length && <Empty loading={roles.loading}>No roles found.</Empty>}
      <div className="grid gap-4 md:grid-cols-2">
        {list.map((r) => (
          <article key={r.id} data-role={r.name} className={`${panel} flex flex-col p-5`}>
            <div className="flex items-start gap-3">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                {r.system ? <Lock className="size-5" /> : <ShieldCheck className="size-5" />}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-semibold">{r.name}</p>
                  {r.system && <Pill tone="amber">system</Pill>}
                </div>
                <p className="text-sm text-foreground/60">{r.description || "No description"}</p>
              </div>
            </div>
            <p className="mt-4 text-xs font-semibold text-foreground/50">
              {r.users} member(s) · {r.permissions.length} permission(s)
            </p>
            <div className="mt-2 flex flex-1 flex-wrap content-start gap-1.5">
              {r.permissions.slice(0, 6).map((p) => <Pill key={p}>{p}</Pill>)}
              {r.permissions.length > 6 && <Pill tone="blue">+{r.permissions.length - 6} more</Pill>}
            </div>
            <div className="mt-4 flex justify-end gap-1 border-t border-black/5 pt-3">
              <IconBtn label="View" icon={Eye} onClick={() => edit({ ...r, readOnly: true })} />
              {can("roles.manage") && !r.system && r.permissions.every(holds) && (
                <IconBtn
                  label="Duplicate"
                  icon={Copy}
                  onClick={() => edit({ id: null, name: `${r.name.slice(0, 45)}_copy`, description: r.description, permissions: r.permissions })}
                />
              )}
              {editable(r) && <IconBtn label="Edit" icon={Pencil} onClick={() => edit(r)} />}
              {editable(r) && (
                <IconBtn
                  label="Delete"
                  icon={Trash2}
                  danger
                  onClick={() =>
                    setConfirm(
                      r.users
                        ? {
                            title: "Role is in use",
                            text: `${r.users} account(s) have "${r.name}". Remove the role from them first (Staff & users page).`,
                            action: "OK",
                            run: () => {},
                          }
                        : {
                            title: "Delete role?",
                            text: `"${r.name}" will be removed permanently.`,
                            action: "Delete role",
                            danger: true,
                            run: async () => {
                              if (await roles.run(`/admin/roles/${r.id}`, "DELETE", undefined, "Role deleted")) {
                                permissions.reload();
                              }
                            },
                          }
                    )
                  }
                />
              )}
            </div>
          </article>
        ))}
      </div>

      {draft && (
        <Modal
          wide
          title={draft.readOnly ? draft.name : draft.id ? "Edit role" : "Create role"}
          text={draft.readOnly ? draft.description || "Role details" : "Name the role and choose what it can do."}
          onClose={() => setDraft(null)}
        >
          <Alert error={roles.error || permissions.error} />
          <form onSubmit={save} className="space-y-5">
            {!draft.readOnly && (
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-sm font-medium">
                  Role name
                  <input
                    required
                    pattern="[a-z][a-z0-9_]+"
                    title="Lowercase letters, numbers and _"
                    placeholder="e.g. content_editor"
                    value={draft.name}
                    onChange={(e) => setDraft({ ...draft, name: e.target.value.toLowerCase().replace(/\s+/g, "_") })}
                    className={`${field} mt-1.5`}
                  />
                </label>
                <label className="block text-sm font-medium">
                  Description
                  <input maxLength={255} placeholder="What is this role for?" value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} className={`${field} mt-1.5`} />
                </label>
              </div>
            )}

            <p className="text-sm font-semibold">{draft.permissions.length} permission(s) selected</p>
            {groups.map(([group, items]) => {
              const keys = items.map((p) => p.key);
              const inGroup = draft.permissions.filter((k) => keys.includes(k));
              const others = draft.permissions.filter((k) => !keys.includes(k));
              const grantable = keys.filter(holds);
              const all = grantable.length > 0 && grantable.every((k) => inGroup.includes(k));
              return (
                <fieldset key={group} className="rounded-2xl border border-black/10 p-4">
                  <legend className="px-1 text-xs font-bold uppercase tracking-wider text-foreground/60">
                    {group} ({inGroup.length}/{keys.length})
                  </legend>
                  {!draft.readOnly && grantable.length > 0 && (
                    <button
                      type="button"
                      className="mb-2 text-xs font-semibold text-primary hover:underline"
                      onClick={() => setDraft({ ...draft, permissions: all ? others : [...others, ...grantable] })}
                    >
                      {all ? "Clear all" : "Select all"}
                    </button>
                  )}
                  <Checks
                    options={items.map((p) => ({
                      value: p.key,
                      label: p.key,
                      hint: !draft.readOnly && !holds(p.key) ? "You do not have this permission" : p.description,
                      disabled: draft.readOnly || !holds(p.key),
                    }))}
                    selected={inGroup}
                    onChange={(next) => setDraft({ ...draft, permissions: [...others, ...next] })}
                  />
                </fieldset>
              );
            })}

            <div className="flex justify-end gap-3">
              <Btn variant="outline" onClick={() => setDraft(null)}>{draft.readOnly ? "Close" : "Cancel"}</Btn>
              {!draft.readOnly && <Btn type="submit" busy={roles.busy}>{draft.id ? "Save changes" : "Create role"}</Btn>}
            </div>
          </form>
        </Modal>
      )}

      <ConfirmModal confirm={confirm} onClose={() => setConfirm(null)} />
      <Toast message={roles.message} onDone={roles.clearMessage} />
    </>
  );
}

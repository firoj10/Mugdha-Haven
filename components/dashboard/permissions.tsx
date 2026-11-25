"use client";

import { useState } from "react";
import { Lock, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { useAuth } from "@/lib/auth";
import {
  Alert, Btn, ConfirmModal, Empty, IconBtn, Modal, PageHeader, Pill, Toast,
  field, panel, useAdminData, type Confirm,
} from "@/components/dashboard/ui";
import { groupPermissions, type Permission } from "@/components/dashboard/permission-groups";

export function PermissionsView() {
  const { can, refresh } = useAuth();
  const permissions = useAdminData<Permission>("/admin/permissions");
  const [editing, setEditing] = useState<Permission | "new" | null>(null);
  const [confirm, setConfirm] = useState<Confirm | null>(null);
  const [search, setSearch] = useState("");
  const manage = can("permissions.manage");
  const current = editing && editing !== "new" ? editing : null;

  const term = search.trim().toLowerCase();
  const groups = groupPermissions(
    permissions.data.filter((p) => `${p.key} ${p.description}`.toLowerCase().includes(term))
  );

  function show(next: Permission | "new") {
    permissions.clearError();
    setEditing(next);
  }

  async function save(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const values = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    const ok = current
      ? await permissions.run(`/admin/permissions/${current.key}`, "PATCH", { description: values.description }, "Permission updated")
      : await permissions.run("/admin/permissions", "POST", values, "Permission created");
    if (ok) {
      setEditing(null);
      refresh();
    }
  }

  return (
    <>
      <PageHeader title="Permissions" text="System permissions are built into the app. You can add your own custom ones.">
        {manage && (
          <Btn onClick={() => show("new")}>
            <Plus className="size-4" /> Create permission
          </Btn>
        )}
      </PageHeader>
      {!editing && <Alert error={permissions.error} />}

      <div className="relative mb-4 max-w-xs">
        <Search className="absolute left-3.5 top-3.5 size-4 text-foreground/40" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search permissions" aria-label="Search permissions" className={`${field} pl-10`} />
      </div>

      {!groups.length && <Empty loading={permissions.loading}>No permissions found.</Empty>}
      <div className="space-y-4">
        {groups.map(([group, items]) => (
          <section key={group} className={`${panel} overflow-x-auto`}>
            <h2 className="border-b border-black/5 px-4 py-3 text-xs font-bold uppercase tracking-wider text-foreground/60">{group}</h2>
            <ul className="divide-y divide-black/5">
              {items.map((p) => (
                <li key={p.key} data-permission={p.key} className="flex flex-wrap items-center gap-3 px-4 py-3">
                  <div className="min-w-56 flex-1">
                    <p className="text-sm font-semibold">{p.key}</p>
                    <p className="text-xs text-foreground/60">{p.description || "No description"}</p>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {p.roles.length
                      ? p.roles.map((r) => <Pill key={r} tone="blue">{r}</Pill>)
                      : <span className="text-xs text-foreground/40">No role (super_admin only)</span>}
                  </div>
                  <Pill tone={p.system ? "gray" : "green"}>{p.system ? "system" : "custom"}</Pill>
                  <div className="flex w-[4.5rem] justify-end gap-1">
                    {p.system && <Lock className="mr-2 size-4 text-foreground/30" aria-label="Locked" />}
                    {!p.system && manage && (
                      <>
                        <IconBtn label="Edit" icon={Pencil} onClick={() => show(p)} />
                        <IconBtn
                          label="Delete"
                          icon={Trash2}
                          danger
                          onClick={() =>
                            setConfirm(
                              p.roles.length
                                ? {
                                    title: "Permission is in use",
                                    text: `Remove "${p.key}" from these roles first: ${p.roles.join(", ")}.`,
                                    action: "OK",
                                    run: () => {},
                                  }
                                : {
                                    title: "Delete permission?",
                                    text: `"${p.key}" will be removed permanently.`,
                                    action: "Delete permission",
                                    danger: true,
                                    run: () => permissions.run(`/admin/permissions/${p.key}`, "DELETE", undefined, "Permission deleted"),
                                  }
                            )
                          }
                        />
                      </>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      {editing && (
        <Modal
          title={current ? "Edit permission" : "Create permission"}
          text="A custom permission restricts something only once the code checks it."
          onClose={() => setEditing(null)}
        >
          <Alert error={permissions.error} />
          <form onSubmit={save} className="space-y-4">
            <label className="block text-sm font-medium">
              Key
              <input
                name="key"
                required
                disabled={Boolean(current)}
                defaultValue={current?.key}
                pattern="[a-z][a-z0-9_]*(\.[a-z][a-z0-9_]*)+"
                title="resource.action, for example reports.export"
                placeholder="reports.export"
                className={`${field} mt-1.5`}
              />
              {current && <span className="mt-1 block text-xs text-foreground/50">The key cannot be renamed, because code refers to it.</span>}
            </label>
            <label className="block text-sm font-medium">
              Description
              <input name="description" maxLength={255} defaultValue={current?.description} placeholder="What does it allow?" className={`${field} mt-1.5`} />
            </label>
            <div className="flex justify-end gap-3">
              <Btn variant="outline" onClick={() => setEditing(null)}>Cancel</Btn>
              <Btn type="submit" busy={permissions.busy}>{current ? "Save changes" : "Create"}</Btn>
            </div>
          </form>
        </Modal>
      )}

      <ConfirmModal confirm={confirm} onClose={() => setConfirm(null)} />
      <Toast message={permissions.message} onDone={permissions.clearMessage} />
    </>
  );
}

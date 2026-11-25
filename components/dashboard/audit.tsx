"use client";

import { Alert, Empty, PageHeader, Pill, panel, useAdminData } from "@/components/dashboard/ui";

type Log = {
  id: number;
  action: string;
  actor: { email: string } | null;
  targetType: string | null;
  targetId: string | null;
  ip: string;
  createdAt: string;
};

export function AuditView() {
  const logs = useAdminData<Log>("/admin/audit-logs?limit=100");

  return (
    <>
      <PageHeader title="Audit log" text="The latest 100 logins and admin changes." />
      <Alert error={logs.error} />
      <section className={`${panel} overflow-x-auto`}>
        {!logs.data.length && <Empty loading={logs.loading}>Nothing recorded yet.</Empty>}
        {logs.data.length > 0 && (
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b border-black/5 text-xs uppercase tracking-wider text-foreground/50">
              <tr>
                {["Time", "Action", "By", "Target", "IP"].map((h) => (
                  <th key={h} className="px-4 py-3 font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {logs.data.map((l) => (
                <tr key={l.id} className="hover:bg-black/[0.02]">
                  <td className="px-4 py-3 text-foreground/60">{new Date(l.createdAt).toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <Pill tone={l.action.includes("failed") ? "red" : "gray"}>{l.action}</Pill>
                  </td>
                  <td className="px-4 py-3">{l.actor?.email ?? "guest"}</td>
                  <td className="px-4 py-3 text-foreground/60">{l.targetType} {l.targetId}</td>
                  <td className="px-4 py-3 text-foreground/60">{l.ip}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </>
  );
}

import { DashboardShell } from "@/components/dashboard/shell";

export const metadata = { title: "Dashboard" };

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <DashboardShell>{children}</DashboardShell>;
}

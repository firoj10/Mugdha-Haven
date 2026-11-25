import { DashboardShell } from "@/components/dashboard/shell";

export const metadata = { title: "My profile" };

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return <DashboardShell>{children}</DashboardShell>;
}
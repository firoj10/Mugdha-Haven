"use client";

import { usePathname } from "next/navigation";
import { SmoothScroll } from "@/components/motion";

// Login, register and the dashboards have their own full-screen layouts, without
// the storefront header and footer.
const STANDALONE = ["/login", "/register", "/admin", "/account"];

export function SiteChrome({
  header,
  footer,
  children,
}: {
  header: React.ReactNode;
  footer: React.ReactNode;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  if (STANDALONE.some((p) => pathname === p || pathname.startsWith(`${p}/`))) {
    return <main>{children}</main>;
  }
  return (
    <SmoothScroll>
      {header}
      <main>{children}</main>
      {footer}
    </SmoothScroll>
  );
}

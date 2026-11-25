import createNextIntlPlugin from "next-intl/plugin";

// Points next-intl at the request config (locale + messages) in ./i18n/request.ts
const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const API_URL = process.env.API_URL ?? "http://localhost:4000";

/** @type {import('next').NextConfig} */
const nextConfig = {
  // The browser only talks to this site; /api is forwarded to the Express backend.
  async rewrites() {
    return [{ source: "/api/:path*", destination: `${API_URL}/api/:path*` }];
  },
  // For product images hosted elsewhere, add the host here, e.g.
  // images: { remotePatterns: [{ protocol: "https", hostname: "cdn.mugdhahaven.com" }] },
};

export default withNextIntl(nextConfig);
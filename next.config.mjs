import createNextIntlPlugin from "next-intl/plugin";

// Points next-intl at the request config (locale + messages) in ./i18n/request.ts
const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
  // When the backend is ready, add product-image hosts here, e.g.
  // images: { remotePatterns: [{ protocol: "https", hostname: "cdn.mugdhahaven.com" }] },
};

export default withNextIntl(nextConfig);

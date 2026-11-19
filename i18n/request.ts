import { getRequestConfig } from "next-intl/server";
import { cookies } from "next/headers";

export const locales = ["en", "bn"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";
export const LOCALE_COOKIE = "locale";

// No URL-prefixed routing: the active locale lives in a cookie (mirrored to
// localStorage by the switcher) so the whole site re-renders on change.
export default getRequestConfig(async () => {
  const cookie = cookies().get(LOCALE_COOKIE)?.value;
  const locale: Locale = locales.includes(cookie as Locale)
    ? (cookie as Locale)
    : defaultLocale;

  return {
    locale,
    messages: (await import(`../locales/${locale}.json`)).default,
  };
});

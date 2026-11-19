import type { Metadata } from "next";
import { Cormorant_Garamond, Inter, Hind_Siliguri } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { CartProvider } from "@/lib/cart";
import { WishlistProvider } from "@/lib/wishlist";
import { FavoritesSheet } from "@/components/favorites-sheet";
import { SmoothScroll } from "@/components/motion";
import { TopBar } from "@/components/top-bar";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import "./globals.css";

const serif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-serif",
});
const sans = Inter({ subsets: ["latin"], variable: "--font-sans" });
const bangla = Hind_Siliguri({
  subsets: ["bengali"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-bangla",
});

export const metadata: Metadata = {
  title: {
    default: "Mugdha Haven — Imported Baby Care & Cosmetics",
    template: "%s · Mugdha Haven",
  },
  description:
    "Authentic imported baby care and cosmetics from the world's most trusted brands. Gentle, verified, delivered across Bangladesh.",
  openGraph: {
    title: "Mugdha Haven",
    description: "Authentic imported baby care & cosmetics.",
    type: "website",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      className={`${serif.variable} ${sans.variable} ${bangla.variable}`}
    >
      <body data-lang={locale}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <CartProvider>
          <WishlistProvider>
            <SmoothScroll>
              <TopBar />
              <Navbar />
              <main>{children}</main>
              <Footer />
            </SmoothScroll>
            <FavoritesSheet />
          </WishlistProvider>
          </CartProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

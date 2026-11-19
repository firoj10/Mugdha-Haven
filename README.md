# Mugdha Haven — Storefront (frontend only)

Premium imported baby-care & cosmetics e-commerce storefront. Next.js App
Router + TypeScript + Tailwind + shadcn/ui + Framer Motion + next-intl.
No backend yet — a typed mock catalog and a thin service layer stand in for it.

## Run

```bash
npm install
npm run dev        # http://localhost:3000
```

Requires Node 18.17+.

## What's inside

```
app/                 routes: / (home), /shop, /product/[slug], /cart, /about
components/          app components (Navbar, ProductCard, Hero, sections…)
components/ui/       shadcn/ui primitives (button, sheet, input, badge, separator)
components/motion.tsx  SmoothScroll + Reveal / Magnetic / Tilt / FlipCard
lib/                 products service, cart state, utils
data/products.ts     mock catalog (the only file the backend replaces)
locales/             en.json, bn.json
i18n/request.ts      next-intl locale + messages (cookie-driven)
```

## Bilingual (English + বাংলা)

- The navbar **EN / বাংলা** switch changes the whole site. The choice is saved
  to a cookie (so server-rendered text updates) and mirrored to `localStorage`.
- The site font swaps to **Hind Siliguri** for Bangla via `body[data-lang="bn"]`.
- Each product carries `description_en` and `description_bn`; the product page
  has its own inline EN/BN toggle, independent of the site language.
- All static UI strings live in `locales/*.json` — add a key to both files.

## Motion

- Scroll reveals (`Reveal`), hero parallax, product 3D tilt on hover (`Tilt`),
  magnetic buttons (`Magnetic`), benefit cards that flip in 3D (`FlipCard`),
  animated add-to-cart, and Lenis smooth scroll.
- All transform-based (GPU) and gated by `prefers-reduced-motion`.

## Connecting the Express backend later

Only two things change — pages and components stay as they are:

1. **`lib/products.ts`** — each function already has the `fetch(...)` call
   commented in. Swap the mock return for the real request; the signatures and
   the `Product` shape don't change.
2. **`data/products.ts`** — delete once the API is live (keep the exported
   `Product` / `Category` types, or move them to `lib/`).

Other backend touch-points are marked with `// TODO` comments: newsletter
signup (`components/newsletter.tsx`) and cart checkout (`components/cart-view.tsx`).

**Product images:** mock products have no `image`, so a styled placeholder
renders. Set `image` to a URL in the catalog and add the host to
`images.remotePatterns` in `next.config.mjs` — `ProductImage` already handles both.

## Brand palette

Beige `#F4EFE7` · Brown `#847563` · Charcoal `#292929` · Cream `#D8C7B2`
(mapped to shadcn tokens in `app/globals.css`).

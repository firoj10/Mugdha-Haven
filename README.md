# Mugdha Haven — Storefront 

Premium imported baby-care & cosmetics e-commerce storefront. Next.js App
Router + TypeScript + Tailwind + shadcn/ui + Framer Motion + next-intl.
Needs the API in `../backend`.

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
lib/types.ts         API data types
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

## Backend

The API is a separate project in `../backend` (see its README). Start it first,
then `npm run dev` here. Next.js forwards `/api/*` to `API_URL`
(default `http://localhost:4000`).

- `lib/products.ts` — catalog for server components
- `lib/api.ts`, `lib/auth.tsx` — browser requests, session and permissions
- `/login`, `/register`, `/account`, `/admin`

Not connected yet: the newsletter and footer subscribe forms.
## Brand palette

Beige `#F4EFE7` · Brown `#847563` · Charcoal `#292929` · Cream `#D8C7B2`
(mapped to shadcn tokens in `app/globals.css`).

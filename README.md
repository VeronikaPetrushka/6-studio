# 6.STUDIO — luxury commerce concept

A cinematic multi-page storefront for **@6.studio_ua** built from the supplied Instagram screenshots and product references.

## Stack
- React 19 + TypeScript + Vite
- GSAP + ScrollTrigger
- Three.js / React Three Fiber / Drei
- React Router
- responsive CSS, custom liquid-glass navigation, 3D hero sculpture

## Routes
- `/` — cinematic home
- `/catalog` — catalogue + categories/search
- `/product/:id` — product gallery + size/format variants
- `/collections` — editorial collections
- `/about` — brand page
- `/cart` — cart
- `/checkout` — ordering + delivery + payment choice
- `/success/:id` — order confirmation
- `/admin` — admin CMS

## Admin
Demo credentials:
- login: `admin`
- password: `studio2026`

Can be changed with:
```env
VITE_ADMIN_LOGIN=
VITE_ADMIN_PASSWORD=
```

Admin functionality:
- products: add / edit / delete / reorder
- filter products by category
- multiple image upload (up to 8), cover selection, image reordering/deletion
- product variants (size/format), individual price and stock
- categories: add/delete
- orders: customer details, contents, totals and statuses
- statuses: New / Seen / In process / Shipped

## Ordering / payment
The demo persists products, categories, cart and orders in localStorage so the whole flow can be tested without a backend.

For production use:
```env
VITE_ORDER_ENDPOINT=https://.../orders
VITE_PAYMENT_ENDPOINT=https://.../payments
```
`VITE_ORDER_ENDPOINT` receives the order JSON. `VITE_PAYMENT_ENDPOINT` receives `{ orderId, total }`; if it returns `{ "redirectUrl": "..." }`, the customer is redirected to the payment provider.

For a real launch, move catalogue/orders/admin authentication and image files to Supabase/Firebase/custom backend + object storage.

## Run
```bash
npm install
npm run dev
```

Build:
```bash
npm run build
```

Vercel SPA rewrites are already configured in `vercel.json`.

## Product data note
The project uses names/prices that were legible in the supplied Instagram screenshots (for example Планета, Busta, Ведмідь, Квітка, Ластівки, Euforia, Pasta, Чисте кохання). Inventory numbers and some descriptive copy are demo content and should be checked before production launch.

## Design direction
The visual direction intentionally avoids the earlier warm editorial candle-store look. It uses a dark cinematic hero, chrome/glass 3D sculpture, liquid-glass navigation, oversized scale typography, split-screen parallax, pinned horizontal products, tactile image transitions, and high-contrast conversion CTAs.

## Kinetic hero (latest revision)
The homepage hero now uses the transparent product cut-outs in `public/hero-objects/` as a lightweight DOM physics pile. Cursor movement repels nearby objects; objects collide, transfer momentum, rotate and settle with gravity/bounce. No additional physics dependency is required.

## Refinement update
- Official 6.STUDIO round mark is used for browser favicon only; the site header keeps the typographic 6.STUDIO wordmark.
- Brand accent changed from wine/burgundy to a muted powder-blue / steel-blue palette.
- Catalogue, Collections and About now have separate cinematic hero compositions and GSAP entrances.
- Product variants can optionally map to a specific image from the product gallery. Selecting a mapped size automatically switches the main image. The Admin product editor exposes this mapping in **Розміри / варіанти → Фото при виборі**.
- The home-page horizontal catalogue and the Lastivky story now use brand-facing copy instead of explaining implementation/scroll mechanics.
- The large table editorial scene uses a scroll-driven camera push for additional depth.


## Custom cursor
Desktop/fine-pointer devices use a pastel-blue GSAP-smoothed circular cursor. It expands on interactive elements, compresses on press, switches to a text mode over form fields, and is automatically disabled for touch/coarse pointers and reduced-motion users.
# 6-studio

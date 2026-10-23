# ShopKart 🛒

A complete, Amazon-inspired e-commerce storefront built with **React + Redux Toolkit** — created as a frontend development assessment. All product data comes live from the [Fake Store API](https://fakestoreapi.com).

## Tech Stack

| Area            | Technology                                    |
| --------------- | --------------------------------------------- |
| Framework       | React 19 + Vite (JavaScript / JSX only)       |
| State           | Redux Toolkit + React Redux + Redux Persist   |
| Routing         | React Router DOM                              |
| Forms           | React Hook Form + Zod (`@hookform/resolvers`) |
| Animations      | Framer Motion, canvas-confetti                |
| Icons           | Lucide React                                  |
| Toasts          | Sonner                                        |
| Styling         | Custom CSS design system (no Tailwind)        |
| Data            | Fake Store API                                |

## Features

### 🏠 Home / Product Listing

- Live product feed from `fakestoreapi.com/products` via a `fetchProducts` Redux thunk
- Category chips, title search, and price/rating sorting
- Pagination — 8 products per page, numbered controls, auto-reset to page 1 on filter changes, scrolls back to the grid on page change
- Loading skeletons, retryable API error states, and empty-search states
- Uniform product cards: fixed-height image frame (`object-fit: contain`), 2-line clamped titles, star rating, and a bottom-pinned price + Add to Cart row
- Deterministic pastel card backgrounds (peach / blue / mint / yellow) keyed by product ID

### ⚡ Flash Sale

- Amazon-style banner with a live countdown (rolls to the next local midnight)
- "Shop Now" button that smooth-scrolls to the deals section
- Horizontally scrollable snap carousel with arrow controls — 4 cards per view on desktop, responsive peek layout on mobile
- 35% demo discount applied client-side (sale price + struck-through original + `−35%` badge; the API exposes no discount data)

### 🛒 Cart

- Fully persistent cart via Redux Persist (`localStorage`)
- Add to cart from product cards, flash cards, and the product detail page
- Quantity steppers everywhere, remove / clear-cart actions
- Order summary with subtotal, item count, $100 free-shipping threshold with progress bar, and shipping calculation
- Coupon validation with discount calculation (`CouponForm`)
- Centralized cart math in `cartSelectors` — no duplicated calculations

### ❤️ Wishlist

- Heart toggle on every product card and the product detail page
- Dedicated `/wishlist` page, persisted across sessions, live count badge in the header

### 🔐 Authentication

- Sign in / sign up / forgot-password flows with Zod-validated React Hook Form forms
- **Local accounts**: signup stores a SHA-256-hashed password in `localStorage`; login verifies the hash (never plaintext)
- **API accounts**: falls back to Fake Store `/users` + `/auth/login`, which returns a real server token
- Demo account: `aiswarya@gmail.com` / `Shopkart@123`
- Protected actions: adding to cart while logged out redirects to `/login` (with a toast) and returns you to the same page after sign-in
- `/cart` and `/checkout` are behind a `RequireAuth` route guard
- Account menu in the header with Orders / Wishlist / Sign out

### 💳 Checkout & Orders

- Validated shipping-details form (React Hook Form + Zod)
- Demo order placement — order snapshot stored in a persisted Redux `orders` slice, cart cleared after
- 🎉 **Confetti blast** animation on the order confirmation screen (respects `prefers-reduced-motion`)
- `/orders` page listing all placed orders with items, totals, and shipping address

### 🔔 Feedback & Status

- Sonner toasts for add-to-cart, wishlist add/remove, auth gating, coupon and newsletter actions
- **API status** — live badge in the header plus a dedicated `/status` page showing request state, last fetch time, endpoint, error details, and retry

### 📱 Responsive & Accessible

- Mobile layouts down to ~320px: hamburger menu, mobile search row, 2-column grids, stacked cart/checkout panels, compact flash cards
- `minmax(0, 1fr)` / `min-width: 0` guards prevent content from overflowing the viewport
- Labels on all inputs, meaningful button names, alt text, visible focus rings, associated error messages, `prefers-reduced-motion` support
- Footer with back-to-top strip, perks row, and newsletter signup

## Project Structure

```
src/
├── app/            # Redux store + storage adapter
├── components/     # Reusable UI (Header, ProductCard, FlashSaleCarousel, …)
├── constants/      # App config (coupons, flash sale, page size)
├── features/       # Redux slices & services (products, cart, wishlist, auth, orders)
├── hooks/          # useRequireAuth, useImageTint
├── pages/          # Route pages (Home, Cart, Checkout, Orders, Login, …)
├── styles/         # Design system (base, components, pages)
├── utils/          # Currency, cart math, coupons, tints, confetti
└── validation/     # Zod schemas
```

## Getting Started

```bash
npm install
npm run dev       # start dev server
npm run build     # production build
npm run lint      # ESLint
npm run preview   # preview production build
```

## Notes

- This is a demo frontend — orders are stored in the browser, and no real payment is processed.
- The Fake Store API has no discount data, so flash-sale pricing is computed client-side.
- Locally registered accounts persist per-browser; Fake Store's seeded accounts also work for login.

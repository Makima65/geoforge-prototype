# 🎨 GeoForge AI Design System & Constraints

## 1. Core Aesthetic
- **Theme:** Pure Dark/Near-Black Mode exclusively. No light mode surfaces or full-bleed gradients.
- **Canvas Colors:** `bg-[#111111]`, `bg-neutral-950`.
- **Card/Surface Colors:** `bg-neutral-900`, `bg-[#1A1A1A]`.
- **Borders:** Thin, dark borders for separation (`border-neutral-800`, `border-white/5`).

## 2. Typography
- **Font Family:** Standard geometric sans (`font-sans`, Inter system defaults).
- **Headings:** Heavy weights (`font-bold`, `font-extrabold`) with tight tracking (`tracking-tight`, `tracking-tighter`). Text color: `text-white`.
- **Body Copy:** Neutral and readable (`text-neutral-400`, `text-neutral-500`).

## 3. The Emerald Accent
- **Primary Color:** High-contrast Emerald Green (`#24b47e` or `#3ecf8e`).
- **Usage:** Sparingly used for primary Call-to-Actions (CTAs), active navigation states, key metrics (e.g., local availability percentages), and active dot indicators.

## 4. Component Geometries (Buttons & Cards)
- **Primary Button:** Emerald green background with high-contrast text (`bg-[#24b47e] hover:bg-[#3ecf8e] text-white font-medium rounded-md`).
- **Secondary Button/Surface:** Translucent gray fill with white text (`bg-white/10 hover:bg-white/20 text-white font-medium rounded-md`).
- **Border Radius:** Technical and tight (`rounded-md` or `rounded-lg`). **No fully rounded pill shapes.**

## 5. Senior UI/UX & Animations
- **Libraries:** `framer-motion`, `react-icons/fi` (Feather), `react-icons/hi2` (Heroicons).
- **Layout Mounting:** Wrap main layouts, views, and lists in `framer-motion` for snappy, responsive entries (e.g., `initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}` with duration `0.25s`). Do not over-animate.
- **Loading States:** Generate shimmering skeleton components (`animate-pulse bg-neutral-800 rounded-md`) that perfectly match the structural layout of data cards/tables to eliminate layout shift. No raw text like "Loading...".
- **Micro-Feedback:** All interactive targets must have tactile states:
  - Click transitions: `active:scale-[0.98] transition-all`
  - Focus rings: `focus:outline-none focus:ring-2 focus:ring-[#3ecf8e]/40`
  - Hover transitions: `duration-200`

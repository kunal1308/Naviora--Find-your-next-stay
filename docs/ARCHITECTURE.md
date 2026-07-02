# Naviora — Architecture & Folder Structure

A feature-based, layered structure. The golden rule:

> **Local-first, promote when shared.**
> If code belongs to one feature, keep it inside that feature. The moment a
> second feature needs it, move it up to the matching top-level folder.

## Map

```
src/
├── app/          Routes only — pages, layouts, route handlers. Keep thin.
├── components/   Shared, reusable UI (Navbar, Footer, Button, Card…).
│   ├── layout/   App chrome (Navbar, Footer).
│   └── ui/       Design-system primitives (Button, Container…). [as needed]
├── features/     Self-contained domain modules (hotels/, booking/, auth/…).
├── hooks/        Shared hooks used by 2+ features (useDebounce…).
├── lib/          Per-integration setup, one folder each: firebase/, cloudinary/, analytics/.
├── services/     Data access — talks to Firebase/APIs (getHotels…).
├── store/        Redux store config + global slices (auth, theme).
├── types/        Shared TS types (Hotel, Booking, User…).
├── utils/        Pure helpers, no I/O (formatCurrency, cn…).
├── constants/    Fixed values (ROUTES, AMENITIES…).
└── styles/       Extra global CSS (main globals.css stays in app/).
```

## How to decide where a file goes

| Question | Folder |
|---|---|
| Is it a route (URL)? | `app/` |
| UI used by only one feature? | `features/<name>/components/` |
| UI reused across features? | `components/` |
| Does it fetch/mutate data (I/O)? | `services/` |
| Does it set up a tool once (Firebase, Query)? | `lib/` |
| Pure function, no I/O? | `utils/` |
| A TypeScript type shared widely? | `types/` |
| Global client state (auth, theme)? | `store/` |

**`lib` vs `services` vs `utils`** — the I/O test:
- `lib/` = _set up_ a tool. `services/` = _use_ it to move data. `utils/` = no I/O at all.

## Data flow (already wired for hotels)

```
app/hotels/page.tsx      (route, Server Component)
   → services/hotels.ts  (getHotels — mock now, Firebase later)
   → features/hotels/components/HotelCard.tsx  (presentation)
```

Only `services/hotels.ts` changes when we move from mock data to Firestore.

## Server vs Client Components

Server by default. Add `"use client"` only when a file needs state, effects,
event handlers, or browser APIs. Today's client islands: `Navbar`, `SearchBar`,
`useDebounce`. Everything else is server-rendered.

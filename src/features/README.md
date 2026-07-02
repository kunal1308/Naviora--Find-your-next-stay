# features/

Each subfolder is a **self-contained domain module** — a mini-app that owns its
own UI, logic, and data access for one part of the product.

```
features/hotels/
├── components/     # UI used only by this feature (e.g. HotelCard)
├── hooks/          # hooks used only by this feature
├── services/       # (optional) feature-specific data access
└── types.ts        # (optional) feature-only types
```

## The one rule that keeps this clean

**Local-first, promote when shared.**

- Belongs to exactly one feature → keep it _inside_ that feature.
- Used by two or more features → move it _up_ to the top-level folder
  (`components/`, `hooks/`, `services/`, `types/`).

Current features: `hotels/`. Planned: `search/`, `booking/`, `wishlist/`,
`reviews/`, `auth/`.

# lib/

Per-integration **setup and singletons** — one folder per external tool. Each
folder initializes a tool once and exports a ready-to-use client/helper. Not
data fetching (that's `services/`), not pure helpers (that's `utils/`).

```
lib/
├── firebase/     app init → exports auth, db  (+ seedData.ts for /api/seed)
├── cloudinary/   image URL builder + unsigned upload helper
└── analytics/    Firebase Analytics init + trackEvent (browser-guarded)
```

Rule of thumb: if it answers _"set up tool X once for the whole app"_, it's `lib/`.
The React mount point for analytics lives in `components/analytics/` — `lib/`
holds logic, `components/` holds React.

# styles/

With Tailwind v4 the design system lives in `app/globals.css` via `@theme`, so
this folder is mostly empty by design.

Use it only for **additional** global stylesheets (e.g. third-party CSS
overrides, print styles). The primary `globals.css` stays in `app/` because the
root layout imports it there.

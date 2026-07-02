<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Project structure

Naviora follows a feature-based, layered structure. Before adding files, read
[docs/ARCHITECTURE.md](docs/ARCHITECTURE.md). Golden rule: **local-first, promote
when shared** — code for one feature lives in `features/<name>/`; move it up to a
top-level folder (`components/`, `hooks/`, `services/`, `types/`) only when a
second feature needs it.

"use client";

// Reusable pager with windowing: always shows first + last + current±1, with
// "…" for gaps — so it stays compact even with many pages (e.g. 1 … 4 5 6 … 20).
// The parent decides what onPage does (URL for hotels, state for admin).

function pageItems(page: number, total: number): (number | "dots")[] {
  const delta = 1; // neighbors around the current page
  const nums: number[] = [];
  for (let i = 1; i <= total; i++) {
    if (i === 1 || i === total || (i >= page - delta && i <= page + delta)) {
      nums.push(i);
    }
  }
  // Insert "dots" where there are gaps (or the single missing page).
  const items: (number | "dots")[] = [];
  let prev = 0;
  for (const n of nums) {
    if (prev) {
      if (n - prev === 2) items.push(prev + 1);
      else if (n - prev > 2) items.push("dots");
    }
    items.push(n);
    prev = n;
  }
  return items;
}

export default function Pagination({
  page,
  totalPages,
  onPage,
}: {
  page: number;
  totalPages: number;
  onPage: (page: number) => void;
}) {
  if (totalPages <= 1) return null;

  const items = pageItems(page, totalPages);
  const arrow =
    "min-w-9 rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100 disabled:opacity-40";

  return (
    <nav className="mt-8 flex flex-wrap items-center justify-center gap-1">
      <button
        type="button"
        onClick={() => onPage(page - 1)}
        disabled={page === 1}
        className={arrow}
      >
        Prev
      </button>

      {items.map((item, i) =>
        item === "dots" ? (
          <span
            key={`dots-${i}`}
            className="px-2 text-sm text-slate-400 select-none"
          >
            …
          </span>
        ) : (
          <button
            key={item}
            type="button"
            onClick={() => onPage(item)}
            aria-current={item === page ? "page" : undefined}
            className={`min-w-9 rounded-lg px-3 py-1.5 text-sm font-medium ${
              item === page
                ? "bg-brand-600 text-white"
                : "border border-slate-300 text-slate-700 hover:bg-slate-100"
            }`}
          >
            {item}
          </button>
        ),
      )}

      <button
        type="button"
        onClick={() => onPage(page + 1)}
        disabled={page === totalPages}
        className={arrow}
      >
        Next
      </button>
    </nav>
  );
}

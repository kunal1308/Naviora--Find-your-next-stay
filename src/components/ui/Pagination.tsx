"use client";

// Simple reusable pager. The parent decides what `onPage` does — update the URL
// (hotels) or local state (admin). Renders nothing if there's only one page.

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

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const btn =
    "min-w-9 rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium disabled:opacity-40";

  return (
    <nav className="mt-8 flex items-center justify-center gap-1">
      <button
        type="button"
        onClick={() => onPage(page - 1)}
        disabled={page === 1}
        className={`${btn} text-slate-600 hover:bg-slate-100`}
      >
        Prev
      </button>
      {pages.map((p) => (
        <button
          key={p}
          type="button"
          onClick={() => onPage(p)}
          aria-current={p === page ? "page" : undefined}
          className={`min-w-9 rounded-lg px-3 py-1.5 text-sm font-medium ${
            p === page
              ? "bg-brand-600 text-white"
              : "border border-slate-300 text-slate-700 hover:bg-slate-100"
          }`}
        >
          {p}
        </button>
      ))}
      <button
        type="button"
        onClick={() => onPage(page + 1)}
        disabled={page === totalPages}
        className={`${btn} text-slate-600 hover:bg-slate-100`}
      >
        Next
      </button>
    </nav>
  );
}

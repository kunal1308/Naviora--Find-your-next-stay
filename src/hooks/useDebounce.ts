"use client";

// Shared hook (used by 2+ features → lives in top-level hooks/).
// Delays a value from updating until it stops changing for `delay` ms —
// perfect for search inputs so we don't fire a request on every keystroke.

import { useEffect, useState } from "react";

export function useDebounce<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);

  return debounced;
}

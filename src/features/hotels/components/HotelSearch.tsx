"use client";

// Search box for the hotels page. Like HotelFilters, the URL is the source of
// truth — typing debounces into the `search` query param, which the server
// component re-reads to filter. Local state keeps typing responsive.

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import SearchInput from "@/components/ui/SearchInput";

export default function HotelSearch() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const urlValue = params.get("search") ?? "";
  const [value, setValue] = useState(urlValue);
  const first = useRef(true);

  // Keep local input in sync if the URL changes elsewhere (e.g. clear all).
  useEffect(() => {
    setValue(urlValue);
  }, [urlValue]);

  // Debounce writes to the URL so we don't navigate on every keystroke.
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    const id = setTimeout(() => {
      if (value === urlValue) return;
      const next = new URLSearchParams(params.toString());
      if (value.trim()) next.set("search", value);
      else next.delete("search");
      next.delete("page");
      const qs = next.toString();
      router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    }, 350);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <SearchInput
      value={value}
      onChange={setValue}
      placeholder="Search hotels by name, city or country"
    />
  );
}

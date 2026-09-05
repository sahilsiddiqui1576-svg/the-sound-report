"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback } from "react";

export interface Facets {
  genres: string[];
  moods: string[];
  languages: string[];
  months: string[];
  years: string[];
}

const FACET_KEYS: (keyof Facets)[] = ["genres", "moods", "languages", "months", "years"];
const PARAM_MAP: Record<keyof Facets, string> = {
  genres: "genre",
  moods: "mood",
  languages: "language",
  months: "month",
  years: "year"
};
const LABEL_MAP: Record<keyof Facets, string> = {
  genres: "Genre",
  moods: "Mood",
  languages: "Language",
  months: "Month",
  years: "Year"
};

export default function FilterBar({ facets }: { facets: Facets }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const setParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (!value) params.delete(key);
      else params.set(key, value);
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [router, pathname, searchParams]
  );

  const hasActiveFilters = FACET_KEYS.some((k) => searchParams.get(PARAM_MAP[k]));

  return (
    <div className="flex flex-wrap items-center gap-3" role="group" aria-label="Filter content">
      {FACET_KEYS.map((key) => {
        if (facets[key].length === 0) return null;
        const paramKey = PARAM_MAP[key];
        return (
          <label key={key} className="flex items-center gap-2 text-sm">
            <span className="sr-only">{LABEL_MAP[key]}</span>
            <select
              value={searchParams.get(paramKey) ?? ""}
              onChange={(e) => setParam(paramKey, e.target.value)}
              className="rounded-lg border border-black/10 bg-transparent px-3 py-2 text-sm
                         focus-visible:outline-2 focus-visible:outline-accent dark:border-white/15"
            >
              <option value="">{LABEL_MAP[key]}: All</option>
              {facets[key].map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </label>
        );
      })}
      {hasActiveFilters && (
        <button
          type="button"
          onClick={() => router.push(pathname)}
          className="text-sm font-medium text-accent hover:underline"
        >
          Clear filters
        </button>
      )}
    </div>
  );
}

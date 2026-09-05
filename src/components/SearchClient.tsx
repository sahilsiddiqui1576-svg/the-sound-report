"use client";

import { useEffect, useMemo, useState } from "react";
import Fuse from "fuse.js";
import Image from "next/image";
import Link from "next/link";
import { Search as SearchIcon } from "lucide-react";
import { COLLECTIONS, CollectionSlug } from "@/lib/types";

interface IndexEntry {
  title: string;
  slug: string;
  collection: CollectionSlug;
  excerpt: string;
  tags: string[];
  genre: string[];
  mood: string[];
  language: string[];
  month: string;
  year: number | null;
  coverImage: string;
  publishDate: string;
}

export default function SearchClient() {
  const [index, setIndex] = useState<IndexEntry[]>([]);
  const [query, setQuery] = useState("");
  const [genre, setGenre] = useState("");
  const [mood, setMood] = useState("");
  const [language, setLanguage] = useState("");

  useEffect(() => {
    fetch("/search-index.json")
      .then((res) => res.json())
      .then(setIndex)
      .catch(() => setIndex([]));
  }, []);

  const fuse = useMemo(
    () =>
      new Fuse(index, {
        keys: ["title", "excerpt", "tags", "genre", "mood", "language"],
        threshold: 0.35
      }),
    [index]
  );

  const facets = useMemo(() => {
    const uniq = (arr: string[]) => Array.from(new Set(arr.filter(Boolean))).sort();
    return {
      genres: uniq(index.flatMap((e) => e.genre)),
      moods: uniq(index.flatMap((e) => e.mood)),
      languages: uniq(index.flatMap((e) => e.language))
    };
  }, [index]);

  const results = useMemo(() => {
    let base = query.trim() ? fuse.search(query).map((r) => r.item) : index;
    if (genre) base = base.filter((e) => e.genre.includes(genre));
    if (mood) base = base.filter((e) => e.mood.includes(mood));
    if (language) base = base.filter((e) => e.language.includes(language));
    return base;
  }, [query, genre, mood, language, fuse, index]);

  return (
    <div>
      <div className="relative">
        <SearchIcon className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search reviews, playlists, artists, reports…"
          aria-label="Search all content"
          className="w-full rounded-full border border-black/10 bg-transparent py-3 pl-11 pr-4 text-base
                     focus-visible:outline-2 focus-visible:outline-accent dark:border-white/15"
        />
      </div>

      <div className="mt-4 flex flex-wrap gap-3">
        <FacetSelect label="Genre" value={genre} onChange={setGenre} options={facets.genres} />
        <FacetSelect label="Mood" value={mood} onChange={setMood} options={facets.moods} />
        <FacetSelect label="Language" value={language} onChange={setLanguage} options={facets.languages} />
      </div>

      <p className="mt-6 text-sm text-neutral-500 dark:text-neutral-400">
        {results.length} result{results.length === 1 ? "" : "s"}
      </p>

      <ul className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {results.map((r) => (
          <li key={`${r.collection}-${r.slug}`}>
            <Link
              href={`/${r.collection}/${r.slug}`}
              className="group flex gap-3 rounded-xl border border-black/5 p-3 transition hover:border-accent/50 dark:border-white/10"
            >
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-neutral-200 dark:bg-neutral-800">
                <Image src={r.coverImage} alt={r.title} fill sizes="64px" className="object-cover" />
              </div>
              <div className="min-w-0">
                <p className="text-xs uppercase tracking-wide text-accent">{COLLECTIONS[r.collection].singularLabel}</p>
                <p className="truncate font-semibold">{r.title}</p>
                <p className="line-clamp-1 text-sm text-neutral-500 dark:text-neutral-400">{r.excerpt}</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>

      {results.length === 0 && (
        <p className="mt-10 text-center text-neutral-500 dark:text-neutral-400">
          No results. Try a different search term or clear a filter.
        </p>
      )}
    </div>
  );
}

function FacetSelect({
  label,
  value,
  onChange,
  options
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  if (options.length === 0) return null;
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      aria-label={label}
      className="rounded-lg border border-black/10 bg-transparent px-3 py-2 text-sm dark:border-white/15"
    >
      <option value="">{label}: All</option>
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  );
}

/**
 * Generates public/search-index.json from every collection's Markdown files.
 * Run automatically before `next build` (see package.json "build" script wiring
 * in README) so the search page can do instant client-side fuzzy search
 * without a database or external search service.
 */
import fs from "fs";
import path from "path";
import { getAllEntries } from "../src/lib/content";

const entries = getAllEntries().map((e) => ({
  title: e.frontmatter.title,
  slug: e.frontmatter.slug,
  collection: e.collection,
  excerpt: e.frontmatter.excerpt,
  tags: e.frontmatter.tags,
  genre: e.frontmatter.genre ?? [],
  mood: e.frontmatter.mood ?? [],
  language: e.frontmatter.language ?? [],
  month: e.frontmatter.month ?? "",
  year: e.frontmatter.year ?? null,
  coverImage: e.frontmatter.coverImage,
  publishDate: e.frontmatter.publishDate
}));

const outPath = path.join(process.cwd(), "public", "search-index.json");
fs.writeFileSync(outPath, JSON.stringify(entries, null, 2));
console.log(`Search index written: ${entries.length} entries -> ${outPath}`);

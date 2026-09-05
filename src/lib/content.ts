import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";
import {
  BaseFrontmatter,
  COLLECTIONS,
  CollectionSlug,
  ContentEntry
} from "./types";

const CONTENT_ROOT = path.join(process.cwd(), "content");

function readCollectionDir(collection: CollectionSlug): string[] {
  const dir = path.join(CONTENT_ROOT, COLLECTIONS[collection].dir);
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter((f) => f.endsWith(".md") || f.endsWith(".mdx"));
}

/** Parses every entry in a collection. Drafts are excluded outside development. */
export function getCollectionEntries(collection: CollectionSlug): ContentEntry[] {
  const files = readCollectionDir(collection);
  const entries = files.map((filename) => {
    const filePath = path.join(CONTENT_ROOT, COLLECTIONS[collection].dir, filename);
    const raw = fs.readFileSync(filePath, "utf-8");
    const { data, content } = matter(raw);
    const frontmatter = data as BaseFrontmatter;
    return {
      frontmatter,
      body: content,
      collection,
      readingTimeMinutes: Math.max(1, Math.ceil(readingTime(content).minutes))
    } satisfies ContentEntry;
  });

  const visible = entries.filter(
    (e) => process.env.NODE_ENV === "development" || !e.frontmatter.draft
  );

  return visible.sort((a, b) => {
    // Manual `order` (set via the Manual Order field in TinaCMS) wins; otherwise sort by date desc.
    const orderA = a.frontmatter.order ?? Number.MAX_SAFE_INTEGER;
    const orderB = b.frontmatter.order ?? Number.MAX_SAFE_INTEGER;
    if (orderA !== orderB) return orderA - orderB;
    return (
      new Date(b.frontmatter.publishDate).getTime() -
      new Date(a.frontmatter.publishDate).getTime()
    );
  });
}

export function getAllEntries(): ContentEntry[] {
  return (Object.keys(COLLECTIONS) as CollectionSlug[]).flatMap(getCollectionEntries);
}

export function getEntryBySlug(
  collection: CollectionSlug,
  slug: string
): ContentEntry | undefined {
  return getCollectionEntries(collection).find((e) => e.frontmatter.slug === slug);
}

export function getFeaturedEntries(limit = 6): ContentEntry[] {
  return getAllEntries()
    .filter((e) => e.frontmatter.featured)
    .slice(0, limit);
}

export function getLatestEntries(limit = 8): ContentEntry[] {
  return getAllEntries().slice(0, limit);
}

/** Distinct filter facets available across all published content. */
export function getFacets() {
  const all = getAllEntries();
  const uniq = (arr: (string | undefined)[]) =>
    Array.from(new Set(arr.filter(Boolean))) as string[];

  return {
    genres: uniq(all.flatMap((e) => e.frontmatter.genre ?? [])).sort(),
    moods: uniq(all.flatMap((e) => e.frontmatter.mood ?? [])).sort(),
    languages: uniq(all.flatMap((e) => e.frontmatter.language ?? [])).sort(),
    months: uniq(all.map((e) => e.frontmatter.month)).sort(),
    years: uniq(all.map((e) => String(e.frontmatter.year ?? ""))).sort().reverse(),
    categories: uniq(all.map((e) => e.frontmatter.category)).sort()
  };
}

export function readSingletonPage(slug: "about" | "contact"): {
  frontmatter: Record<string, unknown>;
  body: string;
} {
  const filePath = path.join(CONTENT_ROOT, "pages", `${slug}.md`);
  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  return { frontmatter: data, body: content };
}

/** Resolves a Tina "reference" field value (a repo-relative file path, e.g.
 * "content/articles/my-post.md") back into a fully parsed ContentEntry by
 * reading that exact file directly, rather than by re-deriving its slug. */
export function getEntryByFilePath(refPath?: string): ContentEntry | undefined {
  if (!refPath) return undefined;
  const absPath = path.join(process.cwd(), refPath.replace(/^\/+/, ""));
  if (!fs.existsSync(absPath)) return undefined;

  const collectionDir = path.basename(path.dirname(absPath));
  const collection = (Object.keys(COLLECTIONS) as CollectionSlug[]).find(
    (c) => COLLECTIONS[c].dir === collectionDir
  );
  if (!collection) return undefined;

  const raw = fs.readFileSync(absPath, "utf-8");
  const { data, content } = matter(raw);
  const frontmatter = data as BaseFrontmatter;
  if (process.env.NODE_ENV !== "development" && frontmatter.draft) return undefined;

  return {
    frontmatter,
    body: content,
    collection,
    readingTimeMinutes: Math.max(1, Math.ceil(readingTime(content).minutes))
  };
}

export interface HomepageConfig {
  heroArticle?: string;
  featuredArticles?: { article?: string }[];
  featuredArtist?: string;
  featuredPlaylist?: string;
  weeklyPick?: string;
  monthlyReview?: string;
  trendReport?: string;
  industryInsight?: string;
  newsletterHeading?: string;
  newsletterBody?: string;
}

/** Reads the editor-controlled homepage configuration. Returns an empty
 * object (never throws) if the file doesn't exist yet, so the homepage can
 * fall back to its automatic "featured"/"latest" behavior. */
export function readHomepageConfig(): HomepageConfig {
  const filePath = path.join(CONTENT_ROOT, "settings", "homepage.md");
  if (!fs.existsSync(filePath)) return {};
  const raw = fs.readFileSync(filePath, "utf-8");
  const { data } = matter(raw);
  return data as HomepageConfig;
}

export function readSiteSettings() {
  const filePath = path.join(CONTENT_ROOT, "settings", "site.md");
  const raw = fs.readFileSync(filePath, "utf-8");
  const { data } = matter(raw);
  return data as {
    siteName: string;
    tagline: string;
    founderName: string;
    defaultSeoDescription: string;
    defaultSeoImage: string;
    socials: { spotify?: string; youtube?: string; instagram?: string; twitter?: string };
  };
}

import type { TinaField } from "tinacms";

/**
 * Shared field groups reused across collections, mirroring the fields in
 * `src/lib/types.ts` (`BaseFrontmatter`). Keep this file and `types.ts` in
 * sync when you add or rename a field.
 */

export const GENRE_OPTIONS = [
  "Pop", "Hip-Hop", "R&B", "Rock", "Indie", "Electronic",
  "Jazz", "Classical", "Folk", "Afrobeats", "Latin", "K-Pop",
  "Country", "Metal", "World", "Other"
];

export const MOOD_OPTIONS = [
  "Uplifting", "Chill", "Melancholic", "Energetic", "Romantic",
  "Introspective", "Rebellious", "Nostalgic", "Dark", "Feel-Good"
];

export const LANGUAGE_OPTIONS = [
  "English", "Hindi", "Spanish", "Korean", "French",
  "Japanese", "Portuguese", "Arabic", "Punjabi", "Other"
];

export const ARTICLE_CATEGORY_OPTIONS = [
  "Music", "Marketing", "Business", "Industry Insights",
  "Technology", "Culture", "Interviews", "Other"
];

export const MONTH_OPTIONS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

/** Title + URL slug — required on every content type. */
export function titleSlugFields(titleLabel = "Title"): TinaField[] {
  return [
    { type: "string", name: "title", label: titleLabel, isTitle: true, required: true },
    {
      type: "string",
      name: "slug",
      label: "Slug",
      required: true,
      description: "Used in the URL, e.g. /articles/your-slug-here"
    }
  ];
}

/** Publish metadata every collection shares: dates, featured/draft flags, manual order. */
export function publishFields(): TinaField[] {
  return [
    { type: "datetime", name: "publishDate", label: "Published Date", required: true },
    { type: "datetime", name: "updatedDate", label: "Updated Date" },
    { type: "boolean", name: "featured", label: "Featured", description: "Show this in Editor's Picks on the homepage" },
    { type: "boolean", name: "draft", label: "Draft (hide from live site)" },
    { type: "number", name: "order", label: "Manual Order", description: "Lower numbers appear first; leave blank to sort by date" }
  ];
}

/** Category + tags + optional genre/mood/language taxonomy. */
export function taxonomyFields(opts?: {
  categoryOptions?: string[];
  includeGenreMoodLanguage?: boolean;
  includeMonthYear?: boolean;
}): TinaField[] {
  const fields: TinaField[] = [
    opts?.categoryOptions
      ? { type: "string", name: "category", label: "Category", options: opts.categoryOptions }
      : { type: "string", name: "category", label: "Category" },
    { type: "string", name: "tags", label: "Tags", list: true }
  ];

  if (opts?.includeGenreMoodLanguage) {
    fields.push(
      { type: "string", name: "genre", label: "Genre", list: true, options: GENRE_OPTIONS },
      { type: "string", name: "mood", label: "Mood", list: true, options: MOOD_OPTIONS },
      { type: "string", name: "language", label: "Language", list: true, options: LANGUAGE_OPTIONS }
    );
  }

  if (opts?.includeMonthYear) {
    fields.push(
      { type: "string", name: "month", label: "Month", options: MONTH_OPTIONS },
      { type: "number", name: "year", label: "Year" }
    );
  }

  return fields;
}

/** Cover image + alt text. */
export function coverImageFields(label = "Cover Image"): TinaField[] {
  return [
    { type: "image", name: "coverImage", label, required: true },
    { type: "string", name: "coverImageAlt", label: `${label} Alt Text` }
  ];
}

/** Excerpt/summary + author byline. */
export function excerptAuthorFields(excerptLabel = "Excerpt"): TinaField[] {
  return [
    { type: "string", name: "excerpt", label: excerptLabel, ui: { component: "textarea" }, required: true },
    { type: "string", name: "author", label: "Author" }
  ];
}

/** Collapsed "SEO" object group, editable per-entry. */
export function seoGroup(): TinaField {
  return {
    type: "object",
    name: "seo_group",
    label: "SEO",
    ui: { collapsed: true },
    fields: [
      { type: "string", name: "seoTitle", label: "SEO Title" },
      { type: "string", name: "seoDescription", label: "SEO Description", ui: { component: "textarea" } },
      { type: "image", name: "seoImage", label: "SEO / Social Share Image" },
      { type: "string", name: "canonicalUrl", label: "Canonical URL" }
    ]
  } as TinaField;
}

/** Streaming-service links reused by both track rows and artist links. Never
 * includes an audio/file field — this site links out to official services,
 * it never hosts or streams audio itself. */
export function streamingLinksFields(): TinaField[] {
  return [
    { type: "string", name: "spotify", label: "Spotify URL" },
    { type: "string", name: "appleMusic", label: "Apple Music URL" },
    { type: "string", name: "amazonMusic", label: "Amazon Music URL" },
    { type: "string", name: "youtube", label: "YouTube URL" }
  ];
}

/** Repeatable track list used by Monthly Reviews, Weekly Picks, Playlists,
 * and Artist Spotlights ("Top Songs"). */
export function tracksField(label = "Tracks"): TinaField {
  return {
    type: "object",
    name: "tracks",
    label,
    list: true,
    ui: {
      itemProps: (item) => ({ label: item?.title ? `${item.title} — ${item.artist ?? ""}` : "New Track" })
    },
    fields: [
      { type: "string", name: "title", label: "Track Title", required: true },
      { type: "string", name: "artist", label: "Artist", required: true },
      { type: "string", name: "album", label: "Album" },
      { type: "string", name: "note", label: "Editorial Note", description: "One-line note on why this track is included" },
      {
        type: "object",
        name: "links",
        label: "Streaming Links",
        fields: streamingLinksFields()
      }
    ]
  } as TinaField;
}

/** Genre + language only (no mood) — used by Artist Spotlights. */
export function genreLanguageFields(): TinaField[] {
  return [
    { type: "string", name: "genre", label: "Genre", list: true, options: GENRE_OPTIONS },
    { type: "string", name: "language", label: "Language", list: true, options: LANGUAGE_OPTIONS }
  ];
}

/** Rich-text article/report body. `isBody: true` maps this straight onto the
 * Markdown body below the frontmatter fence — the exact same format already
 * used across `content/`, so the existing `remark`-based renderer in
 * `src/lib/markdown.ts` keeps working unchanged. */
export function bodyField(label = "Body"): TinaField {
  return { type: "rich-text", name: "body", label, isBody: true } as TinaField;
}

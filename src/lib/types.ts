// Central content model shared by every collection.
// TinaCMS's schema (tina/config.ts) is the source of truth for which fields
// editors see — keep the two in sync when you change this.

export type Genre =
  | "Pop" | "Hip-Hop" | "R&B" | "Rock" | "Indie" | "Electronic"
  | "Jazz" | "Classical" | "Folk" | "Afrobeats" | "Latin" | "K-Pop"
  | "Country" | "Metal" | "World" | "Other";

export type Mood =
  | "Uplifting" | "Chill" | "Melancholic" | "Energetic" | "Romantic"
  | "Introspective" | "Rebellious" | "Nostalgic" | "Dark" | "Feel-Good";

export type Language =
  | "English" | "Hindi" | "Spanish" | "Korean" | "French"
  | "Japanese" | "Portuguese" | "Arabic" | "Punjabi" | "Other";

export type CollectionSlug =
  | "articles"
  | "monthly-reviews"
  | "weekly-picks"
  | "playlists"
  | "artist-spotlights"
  | "trend-reports"
  | "industry-insights";

/** A single track reference — editorial only, no audio is ever hosted or streamed. */
export interface TrackRef {
  title: string;
  artist: string;
  album?: string;
  note?: string; // one-line editorial comment on why the track is included
  links: {
    spotify?: string;
    appleMusic?: string;
    amazonMusic?: string;
    youtube?: string;
  };
}

export interface SEO {
  seoTitle?: string;
  seoDescription?: string;
  seoImage?: string;
  canonicalUrl?: string;
}

export interface BaseFrontmatter extends SEO {
  title: string;
  slug: string;
  publishDate: string; // ISO date, editable in CMS
  updatedDate?: string;
  featured: boolean;
  draft?: boolean;
  category: string;
  tags: string[];
  genre?: Genre[];
  mood?: Mood[];
  language?: Language[];
  month?: string; // e.g. "January"
  year?: number;
  coverImage: string;
  coverImageAlt?: string;
  excerpt: string;
  author?: string;
  order?: number; // manual drag-order weight set via CMS
  // Spotlight-only
  artistName?: string;
  artistImage?: string;
  location?: string;
  country?: string;
  artistLinks?: {
    spotify?: string;
    appleMusic?: string;
    amazonMusic?: string;
    youtube?: string;
    instagram?: string;
    website?: string;
  };
  // Playlist-only
  curator?: string;
  spotifyUrl?: string;
  appleMusicUrl?: string;
  youtubeUrl?: string;
  // Weekly Picks-only display label, e.g. "Week of June 10, 2024"
  weekLabel?: string;
  // Trend Reports-only
  researchNotes?: string;
  // Track-list bearing types (monthly reviews / weekly picks / playlists)
  tracks?: TrackRef[];
}

export interface ContentEntry {
  frontmatter: BaseFrontmatter;
  body: string; // raw MDX body
  collection: CollectionSlug;
  readingTimeMinutes: number;
}

export interface CollectionMeta {
  slug: CollectionSlug;
  label: string;
  singularLabel: string;
  dir: string;
  description: string;
  hasTracks: boolean;
  isSpotlight: boolean;
}

export const COLLECTIONS: Record<CollectionSlug, CollectionMeta> = {
  articles: {
    slug: "articles",
    label: "Articles",
    singularLabel: "Article",
    dir: "articles",
    description: "Editorial coverage of music, marketing, business, technology, and culture.",
    hasTracks: false,
    isSpotlight: false
  },
  "monthly-reviews": {
    slug: "monthly-reviews",
    label: "Monthly Reviews",
    singularLabel: "Monthly Review",
    dir: "monthly-reviews",
    description: "Our editors' deep-dive verdict on the month's essential releases.",
    hasTracks: true,
    isSpotlight: false
  },
  "weekly-picks": {
    slug: "weekly-picks",
    label: "Weekly Picks",
    singularLabel: "Weekly Pick",
    dir: "weekly-picks",
    description: "The tracks worth your attention this week, curated and annotated.",
    hasTracks: true,
    isSpotlight: false
  },
  playlists: {
    slug: "playlists",
    label: "Playlists",
    singularLabel: "Playlist",
    dir: "playlists",
    description: "Themed, mood-built playlists with links to official streaming services.",
    hasTracks: true,
    isSpotlight: false
  },
  "artist-spotlights": {
    slug: "artist-spotlights",
    label: "Artist Spotlights",
    singularLabel: "Artist Spotlight",
    dir: "artist-spotlights",
    description: "Profiles on the artists shaping the sound of now.",
    hasTracks: true,
    isSpotlight: true
  },
  "trend-reports": {
    slug: "trend-reports",
    label: "Trend Reports",
    singularLabel: "Trend Report",
    dir: "trend-reports",
    description: "Data-informed reporting on where music culture is heading.",
    hasTracks: false,
    isSpotlight: false
  },
  "industry-insights": {
    slug: "industry-insights",
    label: "Industry Insights",
    singularLabel: "Industry Insight",
    dir: "industry-insights",
    description: "Analysis on the business, technology, and policy behind the music.",
    hasTracks: false,
    isSpotlight: false
  }
};

export const COLLECTION_SLUGS = Object.keys(COLLECTIONS) as CollectionSlug[];

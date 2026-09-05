import { defineConfig } from "tinacms";
import type { TinaField } from "tinacms";
import {
  ARTICLE_CATEGORY_OPTIONS,
  bodyField,
  coverImageFields,
  excerptAuthorFields,
  genreLanguageFields,
  publishFields,
  seoGroup,
  taxonomyFields,
  titleSlugFields,
  tracksField
} from "./field-groups";

// Vercel sets VERCEL_GIT_COMMIT_REF automatically at build time. TINA_BRANCH
// lets you override it (e.g. for local dev against a specific branch).
const branch =
  process.env.TINA_BRANCH ||
  process.env.NEXT_PUBLIC_TINA_BRANCH ||
  process.env.VERCEL_GIT_COMMIT_REF ||
  process.env.HEAD ||
  "main";

export default defineConfig({
  branch,
  clientId: process.env.NEXT_PUBLIC_TINA_CLIENT_ID || "",
  token: process.env.TINA_TOKEN || "",

  build: {
    outputFolder: "admin",
    publicFolder: "public"
  },

  // Images are uploaded straight into the repo under public/images/uploads
  // and committed to Git — no S3/Cloudinary account needed, and it preserves
  // the exact media path (`/images/uploads/...`) the previous Decap CMS
  // setup used, so next/image and existing content keep working unchanged.
  media: {
    tina: {
      mediaRoot: "images/uploads",
      publicFolder: "public"
    }
  },

  schema: {
    collections: [
      // ============================================================ ARTICLES
      {
        name: "articles",
        label: "Articles",
        path: "content/articles",
        format: "md",
        fields: [
          ...titleSlugFields(),
          ...publishFields(),
          ...taxonomyFields({ categoryOptions: ARTICLE_CATEGORY_OPTIONS }),
          ...coverImageFields(),
          ...excerptAuthorFields(),
          seoGroup(),
          bodyField("Article Body")
        ]
      },

      // ================================================ ARTIST SPOTLIGHTS
      {
        name: "artistSpotlights",
        label: "Artist Spotlights",
        path: "content/artist-spotlights",
        format: "md",
        fields: [
          { type: "string", name: "title", label: "Title", isTitle: true, required: true, description: 'e.g. "Artist Spotlight: Hanumankind"' },
          { type: "string", name: "slug", label: "Slug", required: true },
          ...publishFields(),
          { type: "string", name: "category", label: "Category" },
          { type: "string", name: "tags", label: "Tags", list: true },
          ...genreLanguageFields(),
          { type: "image", name: "coverImage", label: "Cover Image", required: true },
          { type: "string", name: "excerpt", label: "Short Description", ui: { component: "textarea" }, required: true },
          { type: "string", name: "artistName", label: "Artist Name", required: true },
          { type: "image", name: "artistImage", label: "Profile Image", required: true },
          { type: "string", name: "location", label: "Location" },
          { type: "string", name: "country", label: "Country" },
          {
            type: "object",
            name: "artistLinks",
            label: "Social & Streaming Links",
            fields: [
              { type: "string", name: "spotify", label: "Spotify" },
              { type: "string", name: "appleMusic", label: "Apple Music" },
              { type: "string", name: "amazonMusic", label: "Amazon Music" },
              { type: "string", name: "youtube", label: "YouTube" },
              { type: "string", name: "instagram", label: "Instagram" },
              { type: "string", name: "website", label: "Website" }
            ]
          },
          tracksField("Top Songs"),
          seoGroup(),
          bodyField("Full Biography / Profile")
        ]
      },

      // ========================================================= PLAYLISTS
      {
        name: "playlists",
        label: "Playlists",
        path: "content/playlists",
        format: "md",
        fields: [
          ...titleSlugFields("Playlist Title"),
          ...publishFields(),
          ...taxonomyFields({ includeGenreMoodLanguage: true }),
          ...coverImageFields(),
          { type: "string", name: "excerpt", label: "Description", ui: { component: "textarea" }, required: true },
          { type: "string", name: "author", label: "Curator" },
          { type: "string", name: "spotifyUrl", label: "Spotify URL" },
          { type: "string", name: "appleMusicUrl", label: "Apple Music URL" },
          { type: "string", name: "youtubeUrl", label: "YouTube URL" },
          tracksField("Tracks"),
          seoGroup(),
          bodyField("Playlist Body")
        ]
      },

      // ==================================================== MONTHLY REVIEWS
      {
        name: "monthlyReviews",
        label: "Monthly Reviews",
        path: "content/monthly-reviews",
        format: "md",
        fields: [
          ...titleSlugFields(),
          ...publishFields(),
          ...taxonomyFields({ includeGenreMoodLanguage: true, includeMonthYear: true }),
          ...coverImageFields(),
          ...excerptAuthorFields("Summary"),
          tracksField("Track List"),
          seoGroup(),
          bodyField("Review Body")
        ]
      },

      // ======================================================= WEEKLY PICKS
      {
        name: "weeklyPicks",
        label: "Weekly Picks",
        path: "content/weekly-picks",
        format: "md",
        fields: [
          ...titleSlugFields(),
          { type: "string", name: "weekLabel", label: "Week / Date Label", description: 'e.g. "Week of June 10, 2024"' },
          ...publishFields(),
          ...taxonomyFields({ includeGenreMoodLanguage: true }),
          ...coverImageFields(),
          ...excerptAuthorFields("Summary"),
          tracksField("Tracks"),
          seoGroup(),
          bodyField("Content / Body")
        ]
      },

      // ====================================================== TREND REPORTS
      {
        name: "trendReports",
        label: "Trend Reports",
        path: "content/trend-reports",
        format: "md",
        fields: [
          ...titleSlugFields(),
          ...publishFields(),
          ...taxonomyFields(),
          ...coverImageFields(),
          { type: "string", name: "excerpt", label: "Summary", ui: { component: "textarea" }, required: true },
          { type: "string", name: "author", label: "Author" },
          { type: "string", name: "researchNotes", label: "Data / Research Notes", ui: { component: "textarea" }, description: "Optional — supporting data or research notes for this report" },
          seoGroup(),
          bodyField("Report Body")
        ]
      },

      // =================================================== INDUSTRY INSIGHTS
      {
        name: "industryInsights",
        label: "Industry Insights",
        path: "content/industry-insights",
        format: "md",
        fields: [
          ...titleSlugFields(),
          ...publishFields(),
          ...taxonomyFields(),
          ...coverImageFields(),
          ...excerptAuthorFields(),
          seoGroup(),
          bodyField("Article Body")
        ]
      },

      // ============================================================ HOMEPAGE
      // Singleton (one file, content/settings/homepage.md) that controls
      // which existing entries appear in each homepage section. It does NOT
      // change the homepage's design — see src/app/page.tsx.
      {
        name: "homepage",
        label: "Homepage",
        path: "content/settings",
        format: "md",
        match: { include: "homepage" },
        ui: {
          global: true,
          allowedActions: { create: false, delete: false }
        },
        fields: [
          {
            type: "reference",
            name: "heroArticle",
            label: "Hero Article",
            collections: [
              "articles", "monthlyReviews", "weeklyPicks", "playlists",
              "artistSpotlights", "trendReports", "industryInsights"
            ]
          },
          {
            type: "object",
            name: "featuredArticles",
            label: "Featured Articles",
            list: true,
            ui: {
              itemProps: (item) => ({ label: item?.article ? item.article.split("/").pop() : "Featured item" })
            },
            fields: [
              {
                type: "reference",
                name: "article",
                label: "Article",
                collections: [
                  "articles", "monthlyReviews", "weeklyPicks", "playlists",
                  "artistSpotlights", "trendReports", "industryInsights"
                ]
              }
            ]
          } as TinaField,
          { type: "reference", name: "featuredArtist", label: "Featured Artist", collections: ["artistSpotlights"] },
          { type: "reference", name: "featuredPlaylist", label: "Featured Playlist", collections: ["playlists"] },
          { type: "reference", name: "weeklyPick", label: "Weekly Picks Section", collections: ["weeklyPicks"] },
          { type: "reference", name: "monthlyReview", label: "Monthly Review Section", collections: ["monthlyReviews"] },
          { type: "reference", name: "trendReport", label: "Trend Report Section", collections: ["trendReports"] },
          { type: "reference", name: "industryInsight", label: "Industry Insights Section", collections: ["industryInsights"] },
          { type: "string", name: "newsletterHeading", label: "Newsletter / CTA Heading" },
          { type: "string", name: "newsletterBody", label: "Newsletter / CTA Text", ui: { component: "textarea" } }
        ]
      },

      // =============================================================== ABOUT
      {
        name: "about",
        label: "About Page",
        path: "content/pages",
        format: "md",
        match: { include: "about" },
        ui: { global: true, allowedActions: { create: false, delete: false } },
        fields: [
          { type: "string", name: "title", label: "Title", isTitle: true, required: true },
          { type: "string", name: "seoTitle", label: "SEO Title" },
          { type: "string", name: "seoDescription", label: "SEO Description", ui: { component: "textarea" } },
          bodyField("Body")
        ]
      },

      // ============================================================= CONTACT
      {
        name: "contact",
        label: "Contact Page",
        path: "content/pages",
        format: "md",
        match: { include: "contact" },
        ui: { global: true, allowedActions: { create: false, delete: false } },
        fields: [
          { type: "string", name: "title", label: "Title", isTitle: true, required: true },
          bodyField("Body")
        ]
      },

      // ==================================================== SITE SETTINGS
      {
        name: "siteSettings",
        label: "Site Settings",
        path: "content/settings",
        format: "md",
        match: { include: "site" },
        ui: { global: true, allowedActions: { create: false, delete: false } },
        fields: [
          { type: "string", name: "siteName", label: "Site Name", required: true },
          { type: "string", name: "tagline", label: "Tagline", required: true },
          { type: "string", name: "founderName", label: "Founder Name" },
          { type: "string", name: "defaultSeoDescription", label: "Default SEO Description", ui: { component: "textarea" } },
          { type: "image", name: "defaultSeoImage", label: "Default SEO Image" },
          {
            type: "object",
            name: "socials",
            label: "Social Links",
            fields: [
              { type: "string", name: "spotify", label: "Spotify" },
              { type: "string", name: "youtube", label: "YouTube" },
              { type: "string", name: "instagram", label: "Instagram" },
              { type: "string", name: "twitter", label: "Twitter / X" }
            ]
          }
        ]
      }
    ]
  }
});

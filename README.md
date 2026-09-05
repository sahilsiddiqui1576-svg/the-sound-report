# The Sound Report

An independent, editorial music publication — reviews, weekly picks, playlists,
artist spotlights, trend reports, and industry insights. Built with **Next.js 15**,
**React**, **TypeScript**, **Tailwind CSS**, and **Framer Motion**, content-managed
with **Decap CMS** over Markdown files (no database).

Founded and edited by **Sahil Siddiqui**.

> **Editorial policy:** this site never streams or hosts copyrighted audio. Every
> track reference links out to official services (Spotify, Apple Music, Amazon
> Music, YouTube). See `src/components/StreamingLinks.tsx`.

---

## 1. Stack

| Layer      | Choice |
|------------|--------|
| Framework  | Next.js 15 (App Router, static generation) |
| Language   | TypeScript |
| Styling    | Tailwind CSS |
| Animation  | Framer Motion |
| Content    | Markdown files in `/content`, parsed with `gray-matter` |
| Search     | Client-side full-text search via `fuse.js` over a build-time JSON index |
| CMS        | Decap CMS (Git-backed, no database) |
| Hosting    | Vercel (free tier) |
| Code host  | GitHub (free, public or private repo) |

Every service used has a workable free tier.

---

## 2. Local development

```bash
npm install
npm run dev
```

Visit `http://localhost:3000`. The site reads content directly from the `/content`
folder — edit any `.md` file and refresh to see changes (dev mode also shows
`draft: true` entries so you can preview unpublished work).

To preview the CMS locally, run `npx decap-server` in a second terminal and visit
`http://localhost:3000/admin` — local mode talks to your filesystem directly and
skips GitHub OAuth entirely, which is the fastest way to test new fields.

---

## 3. Content model

Every entry (Monthly Review, Weekly Pick, Playlist, Artist Spotlight, Trend
Report, Industry Insight) is a Markdown file with YAML frontmatter. The full
schema lives in `src/lib/types.ts`. Every entry supports:

- `publishDate`, `updatedDate` — editable dates
- `featured` — boolean, surfaces the entry in "Editor's Picks" on the homepage
- `draft` — hides the entry from production builds until ready
- `order` — manual drag-order override (otherwise sorted by publish date)
- `category`, `tags`, `genre[]`, `mood[]`, `language[]`, `month`, `year`
- `coverImage`, `coverImageAlt`
- `seoTitle`, `seoDescription`, `seoImage`, `canonicalUrl`
- `slug` — the URL segment, fully custom
- `tracks[]` — for Monthly Reviews / Weekly Picks / Playlists / Artist Spotlights,
  each with a title, artist, editorial note, and links to official streaming
  services only

Static pages (About, Contact) and global Site Settings (name, tagline, founder
name, socials, default SEO) are single files under `content/pages/` and
`content/settings/`, also editable through the CMS.

---

## 4. Adding a new content type or field

1. Add the field to the relevant collection in `public/admin/config.yml`
   (this is what editors see in the CMS UI).
2. Add the matching field to `BaseFrontmatter` in `src/lib/types.ts`.
3. Rebuild — Next.js reads the new field automatically wherever `frontmatter.*`
   is used; add UI for it in `EditorialCard`, the detail page, or `FilterBar`
   as needed.

Keep `config.yml` and `types.ts` in sync — the CMS doesn't validate against
your TypeScript types automatically.

---

## 5. Deployment: GitHub + Vercel (free)

### 5.1 Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit: The Sound Report"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/the-sound-report.git
git push -u origin main
```

### 5.2 Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) → **Add New → Project** → import your
   GitHub repo. Vercel auto-detects Next.js; no config changes needed.
2. Add an environment variable: `NEXT_PUBLIC_SITE_URL` = your production URL
   (e.g. `https://the-sound-report.vercel.app`) — used for SEO metadata,
   sitemap, and robots.txt.
3. Deploy. Every future push to `main` redeploys automatically.

Optional free-tier form backends (leave unset to keep the newsletter/contact
forms working in "no-op confirmation" mode):

- `NEXT_PUBLIC_NEWSLETTER_ENDPOINT` — e.g. a free Buttondown or Formspree endpoint
- `NEXT_PUBLIC_CONTACT_FORM_ENDPOINT` — e.g. a free Formspree endpoint

### 5.3 Connect Decap CMS (GitHub backend, no Netlify required)

Decap CMS needs an OAuth flow with GitHub to let editors log in and commit
changes. Since this project isn't hosted on Netlify, it uses a small
self-hosted OAuth provider already included at `src/app/api/auth` and
`src/app/api/callback`.

1. **Create a GitHub OAuth App**: GitHub → Settings → Developer settings →
   OAuth Apps → New OAuth App.
   - Homepage URL: `https://your-site.vercel.app`
   - Authorization callback URL: `https://your-site.vercel.app/api/callback`
2. Copy the generated **Client ID** and **Client Secret**.
3. In Vercel → Project → Settings → Environment Variables, add:
   - `GITHUB_OAUTH_CLIENT_ID`
   - `GITHUB_OAUTH_CLIENT_SECRET`
4. Redeploy so the env vars take effect.
5. Edit `public/admin/config.yml`:
   - `backend.repo`: your `username/the-sound-report`
   - `backend.base_url`: your deployed site's origin (the same Vercel URL —
     this project serves the OAuth routes itself, so no separate OAuth
     provider deployment is needed)
6. Visit `https://your-site.vercel.app/admin`, click **Login with GitHub**,
   authorize the app, and you're in.

Only GitHub collaborators on the repo can authenticate and publish — this is
the access control layer, so add editors as repo collaborators.

### 5.4 Editorial workflow

`config.yml` uses `publish_mode: editorial_workflow`, so every change an editor
makes creates a draft PR-style entry reviewable before merging to `main`. Turn
this off (`publish_mode: simple`) if you'd rather publish directly.

---

## 6. Search & filtering

`npm run build` runs `scripts/build-search-index.ts` first, which flattens
every collection into `public/search-index.json`. The `/search` page fetches
this file client-side and runs fuzzy search with `fuse.js`, plus dropdown
filters for genre, mood, and language. Collection listing pages
(`/monthly-reviews`, etc.) filter server-side via URL query params
(`?genre=Indie&month=March&year=2024`) using `FilterBar.tsx`.

---

## 7. Accessibility & SEO notes

- Skip-to-content link, visible focus rings, `aria-current`/`aria-pressed`
  states, reduced-motion media query respected globally.
- Every page ships `<title>`, meta description, Open Graph, and Twitter card
  tags (`generateMetadata` per route); article pages also emit JSON-LD.
- `sitemap.ts` and `robots.ts` are generated automatically from live content.
- Images use `next/image` with responsive `sizes` for performance.

---

## 8. Replacing placeholder assets

All cover/hero images currently shipped are generated placeholder gradients so
the site renders out of the box. Replace them via the CMS's image upload
widget (stored under `public/images/uploads/`) or by swapping files directly
in `public/images/`.

---

## 9. Cost summary

| Service | Tier used | Cost |
|---|---|---|
| GitHub | Free (public/private repo) | $0 |
| Vercel | Hobby | $0 |
| Decap CMS | Open source, self-hosted config | $0 |
| Fonts (Google Fonts via next/font) | Self-hosted at build time | $0 |

No database, no paid APIs, no paid CMS seat licenses.

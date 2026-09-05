# The Sound Report

An independent, editorial music publication — reviews, weekly picks, playlists,
artist spotlights, trend reports, industry insights, and general articles.
Built with **Next.js 15**, **React**, **TypeScript**, **Tailwind CSS**, and
**Framer Motion**, content-managed with **TinaCMS** over Markdown files (no
database).

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
| CMS        | **TinaCMS** — Git-backed, no database, admin at `/admin` |
| CMS auth   | Tina Cloud (free tier is enough for a single editor — see §6) |
| Hosting    | Vercel (free tier) |
| Code host  | GitHub (free, public or private repo) |

---

## 2. Local development

```bash
npm install
npm run dev
```

This starts TinaCMS's local content server **and** `next dev` together, and
visits `http://localhost:3000` as usual. In local dev, TinaCMS talks directly
to your filesystem — no login, no Tina Cloud connection required. This is the
fastest way to try out new fields or content.

To use the CMS locally:

1. Run `npm run dev`.
2. Visit `http://localhost:3000/admin`.
3. You'll land straight in the editor (no login in local dev mode) — pick a
   collection from the sidebar and start editing.
4. Saves write directly to the Markdown files under `content/`, exactly like
   editing them by hand. Refresh the site to see changes.

The site itself still reads content directly from `/content` regardless of
whether Tina is running (`src/lib/content.ts`) — Tina is purely an authoring
layer on top of the same Markdown files, so there is **one source of truth**.

---

## 3. Content model & CMS collections

Every entry is a Markdown file with YAML frontmatter, parsed by `gray-matter`.
The frontmatter shape is defined once in `src/lib/types.ts`; the CMS schema
that generates the editing UI for it lives in `tina/config.ts` (with shared
field groups factored into `tina/field-groups.ts`). **Keep these two files in
sync** when you add or rename a field — Tina doesn't validate against your
TypeScript types automatically.

### Sidebar layout in `/admin`

```
THE SOUND REPORT
----------------
Content
  Articles
  Artist Spotlights
  Playlists
  Monthly Reviews
  Weekly Picks
  Trend Reports
  Industry Insights

Site Content
  Homepage
  About
  Contact

Settings
  Site Settings

Media  (built-in image manager, top-level in Tina's admin)
```

> Tina's admin sidebar lists "global" singleton documents (Homepage, About,
> Contact, Site Settings) separately from list-based collections, which is
> what gives you this grouping automatically. It doesn't support custom
> nested section headers beyond that — functionally it's the same structure,
> just without literal "Content" / "Site Content" divider labels.

### Collections and fields

**1. Articles** (`content/articles/*.md`) — new
title, slug, cover image (+ alt), excerpt, author, published/updated date,
featured, draft, manual order, category (Music / Marketing / Business /
Industry Insights / Technology / Culture / Interviews / Other), tags, SEO
title/description/image/canonical URL, rich-text article body.

**2. Artist Spotlights** (`content/artist-spotlights/*.md`)
title, slug, profile image, short description, full biography (rich text),
genre, language, location, country, social & streaming links (Spotify, Apple
Music, Amazon Music, YouTube, Instagram, website), top songs (repeatable
track list), featured, published date, tags, SEO group.

**3. Playlists** (`content/playlists/*.md`)
playlist title, slug, cover image, description, curator, genre, mood,
language, Spotify/Apple Music/YouTube URLs, tracks, featured, published date,
rich-text playlist body, SEO group.

**4. Monthly Reviews** (`content/monthly-reviews/*.md`)
title, slug, month, year, cover image, summary, author, featured, published
date, genre/mood/language, track list, rich-text review body, SEO group.

**5. Weekly Picks** (`content/weekly-picks/*.md`)
title, slug, week/date label, cover image, summary, author, featured,
published date, genre/mood/language, tracks, rich-text body, SEO group.

**6. Trend Reports** (`content/trend-reports/*.md`)
title, slug, cover image, summary, author, published date, category, tags,
featured, data/research notes, rich-text report body, SEO group.

**7. Industry Insights** (`content/industry-insights/*.md`)
title, slug, cover image, excerpt, author, published date, category, tags,
featured, rich-text article body, SEO title/description.

**Homepage** (`content/settings/homepage.md`) — singleton, new
Controls which existing entries appear in the homepage's existing sections,
**without changing the homepage's design**:
- Hero Article (reference to any collection)
- Featured Articles (list of references, any collection)
- Featured Artist (reference → Artist Spotlights)
- Featured Playlist (reference → Playlists)
- Weekly Picks section (reference → Weekly Picks)
- Monthly Review section (reference → Monthly Reviews)
- Trend Report section (reference → Trend Reports)
- Industry Insights section (reference → Industry Insights)
- Newsletter/CTA heading + body text

If any of these are left empty, the homepage automatically falls back to its
original behavior (auto-featured / most-recent entries), so the site never
renders an empty section.

**About** / **Contact** (`content/pages/about.md`, `content/pages/contact.md`) — singletons
Title (+ SEO fields on About) and a rich-text body.

**Site Settings** (`content/settings/site.md`) — singleton
Site name, tagline, founder name, default SEO description/image, and social
links (Spotify, YouTube, Instagram, Twitter/X).

**Media** — every image field uploads into `public/images/uploads/`, is
committed straight to Git, and is immediately usable via `next/image` — the
exact same storage approach the project's original image handling already
used. No third-party media host or paid storage is required.

---

## 4. Adding a new content type or field

1. Add the field to the relevant collection (or a new collection) in
   `tina/config.ts` (this drives the `/admin` editing UI).
2. Add the matching field to `BaseFrontmatter` in `src/lib/types.ts`, and to
   `COLLECTIONS` if it's a whole new collection.
3. If it's a brand-new collection, add it to `LIST_STYLE` in
   `src/app/[collection]/page.tsx` (`"grid"` or `"list"`) and, if it should be
   in primary navigation, to `NAV` in `src/components/Header.tsx`.
4. Run `npm run dev` — Tina will pick up the schema change immediately, and
   the frontend reads new fields automatically wherever `frontmatter.*` is
   used.

---

## 5. Deployment: GitHub + Vercel

### 5.1 Push to GitHub

```bash
git add .
git commit -m "Replace Decap CMS with TinaCMS"
git push origin main
```

### 5.2 Connect Tina Cloud (one-time setup)

TinaCMS's production auth for a Git-backed site is **Tina Cloud** — it's the
simplest secure option this architecture supports: no OAuth app to register
yourself, no custom auth server to run, and it's free for a single editor.

1. Go to **[app.tina.io](https://app.tina.io)** and sign up / log in.
2. Click **"Import an existing site"** and connect your GitHub account, then
   select the `the-sound-report` repository.
3. Once connected, Tina Cloud shows you a **Client ID**. Generate a **Content
   Token** from the same project page (Tokens tab → "Create new token", give
   it read/write scope on the `main` branch).
4. That's it — no GitHub OAuth App, no client secret to create by hand.

### 5.3 Vercel environment variables

In Vercel → your project → **Settings → Environment Variables**, add:

| Variable | Where to get it |
|---|---|
| `NEXT_PUBLIC_TINA_CLIENT_ID` | Tina Cloud project page (step 5.2) |
| `TINA_TOKEN` | Tina Cloud project page → Tokens (step 5.2) |
| `NEXT_PUBLIC_SITE_URL` | Your production URL, e.g. `https://thesoundreport.vercel.app` |

Optional (leave unset to keep forms in "no-op confirmation" mode):

| Variable | Where to get it |
|---|---|
| `NEXT_PUBLIC_NEWSLETTER_ENDPOINT` | A free Buttondown/Formspree endpoint |
| `NEXT_PUBLIC_CONTACT_FORM_ENDPOINT` | A free Formspree endpoint |

Redeploy after adding these so they take effect.

### 5.4 Vercel build configuration

No changes needed beyond the environment variables above. Vercel's Next.js
preset runs your `package.json` **"build"** script, which is:

```json
"build": "tinacms build && tsx scripts/build-search-index.ts && next build"
```

`tinacms build` regenerates `tina/__generated__` and the static `/admin` app
(under `public/admin`, served automatically by Next.js as static files) using
your live GitHub content and the Tina Cloud credentials above, then the
search index builds, then `next build` runs as before. Both `tina/__generated__`
and `public/admin` are gitignored — they're build output, regenerated on
every deploy — so don't hand-edit or commit them.

### 5.5 Deploy

Push to `main` (or merge a PR into it) — Vercel redeploys automatically, Tina
Cloud content stays in sync with the same GitHub repo, and the CMS at
`/admin` reflects the schema currently on that branch.

---

## 6. Authentication

- **Local dev** (`npm run dev`): no login — Tina talks to your filesystem
  directly. Fine for a single trusted developer machine.
- **Production** (`/admin` on your deployed site): Tina Cloud handles login.
  From the Tina Cloud project page, go to **Users** and invite yourself (and
  anyone else who should be able to publish) by email — they'll get a
  passwordless magic-link sign-in. Nobody else can reach the editor or commit
  changes.
- Publishing still goes straight to your `main` branch via GitHub (through
  Tina Cloud's GitHub App connection) — the same "commit to repo → Vercel
  rebuilds → live" flow as before, just without a hand-rolled OAuth server.

---

## 7. Search & filtering

`npm run build` runs `scripts/build-search-index.ts`, which flattens every
collection (including the new `articles` collection) into
`public/search-index.json`. The `/search` page fetches this file client-side
and runs fuzzy search with `fuse.js`, plus dropdown filters for genre, mood,
and language. Collection listing pages filter server-side via URL query
params using `FilterBar.tsx` — unchanged from before.

---

## 8. Accessibility & SEO notes

Unchanged from the original build: skip-to-content link, visible focus
rings, full `<title>`/meta description/Open Graph/Twitter card coverage per
route, JSON-LD on article pages, generated `sitemap.ts`/`robots.ts`, and
`next/image` throughout.

---

## 9. Limitations & service considerations

- **Tina Cloud is a third-party SaaS**, not something self-hosted in this
  repo. Its free "Starter" tier covers one editor and a handful of
  collaborators, which fits "I am the only person who needs to edit this
  website" — but it is an external dependency, and if Tina changes its free
  tier or you outgrow it, there would be a cost. The self-hosted alternative
  (running your own Tina GraphQL/auth server) avoids that dependency but is
  meaningfully more setup and maintenance for a single-editor site, so it
  isn't what's configured here.
- Tina's admin sidebar doesn't support custom nested section headers — see
  the note in §3. The grouping you get (list collections vs. global singleton
  documents) is close to what was requested but not pixel-identical.
- Images are stored in Git via Tina's built-in "local media" (no S3/Cloudinary
  needed), which is simplest and free, but every uploaded image adds to your
  Git repo size over time — fine at editorial-blog scale, worth knowing about
  long-term.
- No database is introduced; content and media both live in the GitHub repo,
  same as before.

| Service | Tier used | Cost |
|---|---|---|
| GitHub | Free (public/private repo) | $0 |
| Vercel | Hobby | $0 |
| Tina Cloud | Free "Starter" (1 editor) | $0, external SaaS dependency |
| Fonts (Google Fonts via next/font) | Self-hosted at build time | $0 |

No paid APIs or CMS seat licenses at this project's scale.

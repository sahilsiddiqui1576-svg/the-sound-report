import Image from "next/image";
import Link from "next/link";
import { getFeaturedEntries, getLatestEntries, readSiteSettings } from "@/lib/content";
import EditorialCard from "@/components/EditorialCard";
import AnimatedSection from "@/components/AnimatedSection";
import GenreChip from "@/components/GenreChip";
import NewsletterForm from "@/components/NewsletterForm";
import { COLLECTIONS } from "@/lib/types";

const TRENDING_GENRES = [
  { label: "Hip-Hop", change: "+24%" },
  { label: "Indie", change: "+34%" },
  { label: "Pop", change: "+18%" },
  { label: "Punjabi", change: "+39%" },
  { label: "Tamil", change: "+15%" },
  { label: "Telugu", change: "+17%" }
];

export default function HomePage() {
  const featured = getFeaturedEntries(6);
  const latest = getLatestEntries(6);
  const settings = readSiteSettings();

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <Image
            src="/images/hero-crowd.jpg"
            alt=""
            fill
            priority
            className="object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0c] via-[#0a0a0c]/70 to-[#0a0a0c]/30" />
        </div>
        <div className="container-editorial flex min-h-[70vh] flex-col items-center justify-center py-24 text-center text-white">
          <AnimatedSection>
            <h1 className="max-w-3xl font-display text-4xl font-black uppercase leading-[1.05] sm:text-6xl">
              Discover. Analyze. Celebrate.
              <br />
              <span className="text-accent">{settings.tagline}</span>
            </h1>
          </AnimatedSection>
          <AnimatedSection delay={0.1}>
            <p className="mx-auto mt-6 max-w-xl text-base text-neutral-200 sm:text-lg">
              Editorial insights, curated playlists, emerging artists, and data-driven analysis of the sounds shaping the moment.
            </p>
          </AnimatedSection>
          <AnimatedSection delay={0.2} className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href="/monthly-reviews" className="pill-btn">
              Explore Reports
            </Link>
            <Link href="/weekly-picks" className="pill-btn-outline">
              This Week&rsquo;s Picks
            </Link>
          </AnimatedSection>
        </div>
      </section>

      {/* Editor's Picks */}
      <section className="container-editorial py-16">
        <AnimatedSection>
          <div className="mb-6 flex items-end justify-between">
            <h2 className="font-display text-2xl font-extrabold">Editor&rsquo;s Picks</h2>
          </div>
        </AnimatedSection>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {featured.map((entry, i) => (
            <AnimatedSection key={entry.frontmatter.slug} delay={i * 0.05}>
              <EditorialCard entry={entry} badge={badgeFor(entry.collection)} />
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* Trending Genres */}
      <section className="container-editorial py-8">
        <AnimatedSection>
          <div className="mb-6 flex items-end justify-between">
            <h2 className="font-display text-2xl font-extrabold">Trending Genres</h2>
            <Link href="/trend-reports" className="link-arrow">
              View All Trends →
            </Link>
          </div>
        </AnimatedSection>
        <div className="flex gap-3 overflow-x-auto pb-2">
          {TRENDING_GENRES.map((g) => (
            <GenreChip key={g.label} label={g.label} changeLabel={g.change} />
          ))}
        </div>
      </section>

      {/* Latest Articles */}
      <section className="container-editorial py-16">
        <AnimatedSection>
          <div className="mb-6 flex items-end justify-between">
            <h2 className="font-display text-2xl font-extrabold">Latest Articles</h2>
            <Link href="/search" className="link-arrow">
              View All Articles →
            </Link>
          </div>
        </AnimatedSection>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {latest.map((entry, i) => (
            <AnimatedSection key={`${entry.collection}-${entry.frontmatter.slug}`} delay={i * 0.05}>
              <EditorialCard entry={entry} />
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <section className="border-t border-black/5 bg-black/[.02] py-16 dark:border-white/10 dark:bg-white/[.02]">
        <div className="container-editorial flex flex-col items-center gap-4 text-center">
          <h2 className="font-display text-2xl font-extrabold">Stay in the Loop</h2>
          <p className="max-w-md text-neutral-500 dark:text-neutral-400">
            Get the best of {settings.siteName} delivered to your inbox every week.
          </p>
          <NewsletterForm />
        </div>
      </section>
    </div>
  );
}

function badgeFor(collection: keyof typeof COLLECTIONS) {
  const map: Record<string, string> = {
    "monthly-reviews": "Spotlight",
    "weekly-picks": "Trending Now",
    playlists: "Featured Playlist",
    "artist-spotlights": "Artist Spotlight",
    "trend-reports": "Trend Report",
    "industry-insights": "Industry Insight"
  };
  return map[collection];
}

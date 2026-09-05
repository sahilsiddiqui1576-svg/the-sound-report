import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { COLLECTIONS, CollectionSlug, COLLECTION_SLUGS } from "@/lib/types";
import { getCollectionEntries, getFacets } from "@/lib/content";
import EditorialCard from "@/components/EditorialCard";
import ArticleListItem from "@/components/ArticleListItem";
import FilterBar from "@/components/FilterBar";
import AnimatedSection from "@/components/AnimatedSection";
import { Suspense } from "react";

export function generateStaticParams() {
  return COLLECTION_SLUGS.map((collection) => ({ collection }));
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ collection: string }>;
}): Promise<Metadata> {
  const { collection } = await params;
  const meta = COLLECTIONS[collection as CollectionSlug];
  if (!meta) return {};
  return {
    title: meta.label,
    description: meta.description,
    openGraph: { title: meta.label, description: meta.description }
  };
}

// Layout style per collection: grid (visual, cover-driven) vs list (editorial, row-driven)
const LIST_STYLE: Record<CollectionSlug, "grid" | "list"> = {
  articles: "list",
  "monthly-reviews": "grid",
  "weekly-picks": "grid",
  playlists: "grid",
  "artist-spotlights": "list",
  "trend-reports": "list",
  "industry-insights": "list"
};

export default async function CollectionPage({
  params,
  searchParams
}: {
  params: Promise<{ collection: string }>;
  searchParams: Promise<{ genre?: string; mood?: string; language?: string; month?: string; year?: string }>;
}) {
  const { collection: collectionParam } = await params;
  const sp = await searchParams;
  const collection = collectionParam as CollectionSlug;
  const meta = COLLECTIONS[collection];
  if (!meta) notFound();

  let entries = getCollectionEntries(collection);

  if (sp.genre) entries = entries.filter((e) => e.frontmatter.genre?.includes(sp.genre as never));
  if (sp.mood) entries = entries.filter((e) => e.frontmatter.mood?.includes(sp.mood as never));
  if (sp.language) entries = entries.filter((e) => e.frontmatter.language?.includes(sp.language as never));
  if (sp.month) entries = entries.filter((e) => e.frontmatter.month === sp.month);
  if (sp.year) entries = entries.filter((e) => String(e.frontmatter.year) === sp.year);

  const facets = getFacets();
  const style = LIST_STYLE[collection];

  return (
    <div className="container-editorial py-14">
      <AnimatedSection>
        <h1 className="font-display text-3xl font-black sm:text-4xl">{meta.label}</h1>
        <p className="mt-2 max-w-2xl text-neutral-500 dark:text-neutral-400">{meta.description}</p>
      </AnimatedSection>

      <div className="mt-8">
        <Suspense>
          <FilterBar facets={facets} />
        </Suspense>
      </div>

      <div className="mt-8">
        {entries.length === 0 && (
          <p className="text-neutral-500 dark:text-neutral-400">No entries match these filters yet.</p>
        )}

        {style === "grid" ? (
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
            {entries.map((entry, i) => (
              <AnimatedSection key={entry.frontmatter.slug} delay={Math.min(i * 0.04, 0.3)}>
                <EditorialCard entry={entry} size="lg" />
              </AnimatedSection>
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {entries.map((entry, i) => (
              <AnimatedSection key={entry.frontmatter.slug} delay={Math.min(i * 0.04, 0.3)}>
                <ArticleListItem entry={entry} />
              </AnimatedSection>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

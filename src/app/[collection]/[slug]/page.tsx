import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import { format } from "date-fns";
import { COLLECTIONS, CollectionSlug, COLLECTION_SLUGS } from "@/lib/types";
import { getCollectionEntries, getEntryBySlug, readSiteSettings } from "@/lib/content";
import { renderMarkdown } from "@/lib/markdown";
import Breadcrumb from "@/components/Breadcrumb";
import TrackTable from "@/components/TrackTable";
import StreamingLinks from "@/components/StreamingLinks";
import AnimatedSection from "@/components/AnimatedSection";

export function generateStaticParams() {
  return COLLECTION_SLUGS.flatMap((collection) =>
    getCollectionEntries(collection).map((e) => ({ collection, slug: e.frontmatter.slug }))
  );
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ collection: string; slug: string }>;
}): Promise<Metadata> {
  const { collection: collectionParam, slug } = await params;
  const collection = collectionParam as CollectionSlug;
  if (!COLLECTIONS[collection]) return {};
  const entry = getEntryBySlug(collection, slug);
  if (!entry) return {};
  const { frontmatter } = entry;
  const settings = readSiteSettings();
  const title = frontmatter.seoTitle || frontmatter.title;
  const description = frontmatter.seoDescription || frontmatter.excerpt;
  const image = frontmatter.seoImage || frontmatter.coverImage;

  return {
    title,
    description,
    alternates: frontmatter.canonicalUrl ? { canonical: frontmatter.canonicalUrl } : undefined,
    openGraph: {
      title,
      description,
      images: [image],
      type: "article",
      publishedTime: frontmatter.publishDate,
      siteName: settings.siteName
    },
    twitter: { card: "summary_large_image", title, description, images: [image] }
  };
}

export default async function EntryDetailPage({
  params
}: {
  params: Promise<{ collection: string; slug: string }>;
}) {
  const { collection: collectionParam, slug } = await params;
  const collection = collectionParam as CollectionSlug;
  const meta = COLLECTIONS[collection];
  if (!meta) notFound();

  const entry = getEntryBySlug(collection, slug);
  if (!entry) notFound();

  const { frontmatter, body, readingTimeMinutes } = entry;
  const bodyHtml = await renderMarkdown(body);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: frontmatter.title,
    datePublished: frontmatter.publishDate,
    dateModified: frontmatter.updatedDate || frontmatter.publishDate,
    image: frontmatter.coverImage,
    author: { "@type": "Person", name: frontmatter.author || "The Sound Report Editors" }
  };

  return (
    <article className="container-editorial py-12">
      {/* eslint-disable-next-line react/no-danger */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <Breadcrumb
        items={[
          { href: "/", label: "Home" },
          { href: `/${collection}`, label: meta.label },
          { label: frontmatter.title }
        ]}
      />

      <AnimatedSection>
        <div className="relative mb-8 aspect-[16/9] w-full overflow-hidden rounded-2xl bg-neutral-200 dark:bg-neutral-800">
          <Image
            src={frontmatter.coverImage}
            alt={frontmatter.coverImageAlt || frontmatter.title}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </div>

        <p className="text-xs uppercase tracking-wider text-accent">
          {frontmatter.category} {frontmatter.month ? `· ${frontmatter.month} ${frontmatter.year ?? ""}` : ""}
        </p>
        <h1 className="mt-2 font-display text-3xl font-black leading-tight sm:text-4xl">{frontmatter.title}</h1>
        <p className="mt-3 text-sm text-neutral-500 dark:text-neutral-400">
          {format(new Date(frontmatter.publishDate), "MMMM d, yyyy")} · {readingTimeMinutes} min read
          {frontmatter.author ? ` · By ${frontmatter.author}` : ""}
        </p>

        {meta.isSpotlight && frontmatter.artistLinks && (
          <div className="mt-4">
            <StreamingLinks links={frontmatter.artistLinks} />
          </div>
        )}
      </AnimatedSection>

      <AnimatedSection delay={0.1} className="prose prose-neutral mt-8 max-w-3xl dark:prose-invert">
        {/* eslint-disable-next-line react/no-danger */}
        <div dangerouslySetInnerHTML={{ __html: bodyHtml }} />
      </AnimatedSection>

      {meta.hasTracks && frontmatter.tracks && frontmatter.tracks.length > 0 && (
        <AnimatedSection delay={0.15} className="mt-12 max-w-3xl">
          <TrackTable tracks={frontmatter.tracks} title={meta.isSpotlight ? "Top Songs" : "Track List"} />
        </AnimatedSection>
      )}

      <AnimatedSection delay={0.2} className="mt-10 flex flex-wrap gap-2">
        {frontmatter.tags?.map((tag) => (
          <span key={tag} className="rounded-full border border-black/10 px-3 py-1 text-xs text-neutral-500 dark:border-white/15 dark:text-neutral-400">
            #{tag}
          </span>
        ))}
      </AnimatedSection>
    </article>
  );
}

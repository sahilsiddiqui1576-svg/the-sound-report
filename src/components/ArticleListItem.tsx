import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { ContentEntry } from "@/lib/types";

/** Horizontal row card used for Trend Reports / Industry Insights / Artist Spotlights lists. */
export default function ArticleListItem({ entry }: { entry: ContentEntry }) {
  const { frontmatter, collection } = entry;
  const href = `/${collection}/${frontmatter.slug}`;

  return (
    <Link
      href={href}
      className="group flex items-center gap-4 rounded-xl border border-black/5 bg-white p-3 transition
                 hover:border-accent/50 dark:border-white/10 dark:bg-surface-dark"
    >
      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-neutral-200 dark:bg-neutral-800 sm:h-20 sm:w-20">
        <Image
          src={frontmatter.artistImage || frontmatter.coverImage}
          alt={frontmatter.title}
          fill
          sizes="80px"
          className="object-cover transition duration-500 group-hover:scale-105"
        />
      </div>
      <div className="min-w-0 flex-1">
        <h3 className="truncate font-display text-base font-bold">{frontmatter.title}</h3>
        {frontmatter.excerpt && (
          <p className="mt-0.5 line-clamp-1 text-sm text-neutral-500 dark:text-neutral-400">
            {frontmatter.excerpt}
          </p>
        )}
        <p className="mt-1 text-xs text-neutral-400">
          {format(new Date(frontmatter.publishDate), "MMM d, yyyy")}
        </p>
      </div>
      <span className="link-arrow shrink-0">Read More →</span>
    </Link>
  );
}

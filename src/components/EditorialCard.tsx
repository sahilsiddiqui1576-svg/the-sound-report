import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { ContentEntry } from "@/lib/types";
import { COLLECTIONS } from "@/lib/types";

interface Props {
  entry: ContentEntry;
  badge?: string;
  size?: "sm" | "md" | "lg";
}

export default function EditorialCard({ entry, badge, size = "md" }: Props) {
  const { frontmatter, collection } = entry;
  const href = `/${collection}/${frontmatter.slug}`;
  const aspect = size === "lg" ? "aspect-[4/3]" : "aspect-square";

  return (
    <Link
      href={href}
      className="group block overflow-hidden rounded-2xl border border-black/5 bg-white transition
                 hover:-translate-y-1 hover:shadow-lg dark:border-white/10 dark:bg-surface-dark"
    >
      <div className={`relative ${aspect} w-full overflow-hidden bg-neutral-200 dark:bg-neutral-800`}>
        <Image
          src={frontmatter.coverImage}
          alt={frontmatter.coverImageAlt || frontmatter.title}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className="object-cover transition duration-500 group-hover:scale-105"
        />
        {badge && (
          <span className="absolute left-3 top-3 rounded-full bg-black/70 px-3 py-1 text-[10px]
                            font-semibold uppercase tracking-wider text-accent backdrop-blur">
            {badge}
          </span>
        )}
      </div>
      <div className="p-4">
        <p className="text-xs uppercase tracking-wider text-neutral-400">
          {frontmatter.month ? `${frontmatter.month} ${frontmatter.year ?? ""}` : COLLECTIONS[collection].singularLabel}
        </p>
        <h3 className="mt-1 line-clamp-2 font-display text-base font-bold leading-snug">
          {frontmatter.title}
        </h3>
        <span className="link-arrow mt-2 inline-block">Read Report →</span>
      </div>
    </Link>
  );
}

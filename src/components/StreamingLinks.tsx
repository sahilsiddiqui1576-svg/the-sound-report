import { ExternalLink } from "lucide-react";

export interface StreamingLinkSet {
  spotify?: string;
  appleMusic?: string;
  amazonMusic?: string;
  youtube?: string;
}

const LABELS: Record<keyof StreamingLinkSet, string> = {
  spotify: "Spotify",
  appleMusic: "Apple Music",
  amazonMusic: "Amazon Music",
  youtube: "YouTube"
};

/**
 * Renders outbound links to official streaming platforms only.
 * The Sound Report never embeds, hosts, or streams copyrighted audio itself.
 */
export default function StreamingLinks({ links, compact = false }: { links: StreamingLinkSet; compact?: boolean }) {
  const entries = (Object.keys(LABELS) as (keyof StreamingLinkSet)[]).filter((k) => links[k]);
  if (entries.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label="Listen on official streaming services">
      {entries.map((key) => (
        <a
          key={key}
          href={links[key]}
          target="_blank"
          rel="noopener noreferrer nofollow"
          className={`inline-flex items-center gap-1.5 rounded-full border border-black/10 font-medium
                      transition hover:border-accent hover:text-accent dark:border-white/15
                      ${compact ? "px-2.5 py-1 text-xs" : "px-4 py-2 text-sm"}`}
        >
          {LABELS[key]}
          <ExternalLink size={compact ? 11 : 13} aria-hidden />
        </a>
      ))}
    </div>
  );
}

import { TrackRef } from "@/lib/types";
import StreamingLinks from "./StreamingLinks";

export default function TrackTable({ tracks, title = "Track List" }: { tracks: TrackRef[]; title?: string }) {
  if (!tracks?.length) return null;

  return (
    <div>
      <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-neutral-400">{title}</h3>
      <ol className="divide-y divide-black/5 dark:divide-white/10">
        {tracks.map((track, i) => (
          <li key={`${track.title}-${i}`} className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">
              <span className="w-6 shrink-0 pt-0.5 font-mono text-sm text-neutral-400">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <p className="font-medium">{track.title}</p>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  {track.artist}
                  {track.album ? ` · ${track.album}` : ""}
                </p>
                {track.note && (
                  <p className="mt-1 text-sm italic text-neutral-500 dark:text-neutral-400">{track.note}</p>
                )}
              </div>
            </div>
            <StreamingLinks links={track.links} compact />
          </li>
        ))}
      </ol>
    </div>
  );
}

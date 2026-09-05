import type { Metadata } from "next";
import SearchClient from "@/components/SearchClient";
import AnimatedSection from "@/components/AnimatedSection";

export const metadata: Metadata = {
  title: "Search",
  description: "Search reviews, playlists, artist spotlights, and reports."
};

export default function SearchPage() {
  return (
    <div className="container-editorial py-14">
      <AnimatedSection>
        <h1 className="font-display text-3xl font-black sm:text-4xl">Search</h1>
        <p className="mt-2 text-neutral-500 dark:text-neutral-400">
          Full-text search across every article, playlist, and spotlight — filterable by genre, mood, and language.
        </p>
      </AnimatedSection>
      <div className="mt-8">
        <SearchClient />
      </div>
    </div>
  );
}

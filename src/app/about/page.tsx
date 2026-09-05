import type { Metadata } from "next";
import Image from "next/image";
import { BookOpen, BarChart3, ListMusic, Compass } from "lucide-react";
import { readSingletonPage, readSiteSettings } from "@/lib/content";
import { renderMarkdown } from "@/lib/markdown";
import AnimatedSection from "@/components/AnimatedSection";

export const metadata: Metadata = {
  title: "About",
  description: "The story, mission, and editorial team behind The Sound Report."
};

const PILLARS = [
  { icon: BookOpen, label: "Editorial" },
  { icon: BarChart3, label: "Analysis" },
  { icon: ListMusic, label: "Curation" },
  { icon: Compass, label: "Discovery" }
];

export default async function AboutPage() {
  const { frontmatter, body } = readSingletonPage("about");
  const settings = readSiteSettings();
  const bodyHtml = await renderMarkdown(body);

  return (
    <div>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <Image src="/images/about-hero.jpg" alt="" fill className="object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0c] via-[#0a0a0c]/80 to-[#0a0a0c]/40" />
        </div>
        <div className="container-editorial flex min-h-[40vh] flex-col justify-center py-20 text-white">
          <AnimatedSection>
            <p className="text-xs uppercase tracking-wider text-accent">About {settings.siteName}</p>
            <h1 className="mt-2 max-w-2xl font-display text-3xl font-black sm:text-5xl">
              {(frontmatter.title as string) || `About ${settings.siteName}`}
            </h1>
          </AnimatedSection>
        </div>
      </section>

      <section className="container-editorial py-14">
        <AnimatedSection>
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            {PILLARS.map(({ icon: Icon, label }) => (
              <div key={label} className="flex flex-col items-center gap-2 rounded-2xl border border-black/5 p-6 text-center dark:border-white/10">
                <Icon className="text-accent" size={28} aria-hidden />
                <span className="font-display font-bold">{label}</span>
              </div>
            ))}
          </div>
        </AnimatedSection>

        <AnimatedSection
          delay={0.1}
          className="prose prose-neutral mt-12 max-w-3xl dark:prose-invert"
        >
          {/* eslint-disable-next-line react/no-danger */}
          <div dangerouslySetInnerHTML={{ __html: bodyHtml }} />
        </AnimatedSection>

        <AnimatedSection delay={0.2} className="mt-12 max-w-3xl border-t border-black/5 pt-6 text-sm text-neutral-500 dark:border-white/10 dark:text-neutral-400">
          <p>
            {settings.siteName} is founded and edited by{" "}
            <span className="font-semibold text-neutral-700 dark:text-neutral-200">{settings.founderName}</span>.
          </p>
        </AnimatedSection>
      </section>
    </div>
  );
}

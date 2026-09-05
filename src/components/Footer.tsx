import Link from "next/link";
import { Instagram, Twitter, Youtube, Music2 } from "lucide-react";
import WaveformLogo from "./WaveformLogo";

interface FooterProps {
  siteName: string;
  tagline: string;
  founderName: string;
  socials: { spotify?: string; youtube?: string; instagram?: string; twitter?: string };
}

const EXPLORE = [
  { href: "/monthly-reviews", label: "Monthly Reviews" },
  { href: "/weekly-picks", label: "Weekly Picks" },
  { href: "/playlists", label: "Playlists" },
  { href: "/artist-spotlights", label: "Artist Spotlights" }
];

const ANALYTICS = [
  { href: "/trend-reports", label: "Trend Reports" },
  { href: "/industry-insights", label: "Industry Insights" },
  { href: "/search", label: "Search" }
];

const INFO = [
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms of Use" }
];

export default function Footer({ siteName, tagline, founderName, socials }: FooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-black/5 bg-paper dark:border-white/10 dark:bg-[#0a0a0c]">
      <div className="container-editorial grid grid-cols-2 gap-10 py-14 sm:grid-cols-4">
        <div className="col-span-2 sm:col-span-1">
          <Link href="/" className="flex items-center gap-2">
            <WaveformLogo size={22} />
            <span className="font-display text-base font-extrabold uppercase">{siteName}</span>
          </Link>
          <p className="mt-3 max-w-xs text-sm text-neutral-500 dark:text-neutral-400">{tagline}</p>
          <div className="mt-4 flex gap-3 text-neutral-500 dark:text-neutral-400">
            {socials.instagram && (
              <a href={socials.instagram} aria-label="Instagram" className="hover:text-accent">
                <Instagram size={18} />
              </a>
            )}
            {socials.twitter && (
              <a href={socials.twitter} aria-label="Twitter / X" className="hover:text-accent">
                <Twitter size={18} />
              </a>
            )}
            {socials.youtube && (
              <a href={socials.youtube} aria-label="YouTube" className="hover:text-accent">
                <Youtube size={18} />
              </a>
            )}
            {socials.spotify && (
              <a href={socials.spotify} aria-label="Spotify" className="hover:text-accent">
                <Music2 size={18} />
              </a>
            )}
          </div>
        </div>

        <FooterColumn title="Explore" links={EXPLORE} />
        <FooterColumn title="Analytics" links={ANALYTICS} />
        <FooterColumn title="Info" links={INFO} />
      </div>

      <div className="border-t border-black/5 py-6 dark:border-white/10">
        <div className="container-editorial flex flex-col items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400 sm:flex-row sm:justify-between">
          <p>
            © {year} {siteName}. All rights reserved.
          </p>
          <p>
            Founded and edited by <span className="text-neutral-700 dark:text-neutral-300">{founderName}</span>
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }: { title: string; links: { href: string; label: string }[] }) {
  return (
    <nav aria-label={title}>
      <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-400">{title}</h3>
      <ul className="mt-3 space-y-2">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="text-sm text-neutral-600 hover:text-accent dark:text-neutral-300">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

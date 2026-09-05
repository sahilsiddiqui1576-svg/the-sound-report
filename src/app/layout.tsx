import type { Metadata } from "next";
// import { Inter, Archivo, JetBrains_Mono } from "next/font/google"; // disabled for offline sandbox test
import "./globals.css";
import ThemeProvider from "@/components/ThemeProvider";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { readSiteSettings } from "@/lib/content";

const sans = { variable: "" };
const display = { variable: "" };
const mono = { variable: "" };

const settings = readSiteSettings();
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://thesoundreport.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: settings.siteName, template: `%s · ${settings.siteName}` },
  description: settings.defaultSeoDescription,
  openGraph: {
    title: settings.siteName,
    description: settings.defaultSeoDescription,
    images: [settings.defaultSeoImage],
    type: "website",
    siteName: settings.siteName
  },
  twitter: {
    card: "summary_large_image",
    title: settings.siteName,
    description: settings.defaultSeoDescription,
    images: [settings.defaultSeoImage]
  },
  icons: { icon: "/favicon.ico" }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${sans.variable} ${display.variable} ${mono.variable}`}>
      <body>
        <ThemeProvider>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100]
                       focus:rounded-lg focus:bg-accent focus:px-4 focus:py-2 focus:text-white"
          >
            Skip to content
          </a>
          <Header siteName={settings.siteName} tagline={settings.tagline} />
          <main id="main-content">{children}</main>
          <Footer
            siteName={settings.siteName}
            tagline={settings.tagline}
            founderName={settings.founderName}
            socials={settings.socials}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}

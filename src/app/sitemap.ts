import { MetadataRoute } from "next";
import { getAllEntries } from "@/lib/content";
import { COLLECTION_SLUGS } from "@/lib/types";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://thesoundreport.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = ["", "/about", "/contact", "/search", ...COLLECTION_SLUGS.map((c) => `/${c}`)].map((p) => ({
    url: `${siteUrl}${p}`,
    lastModified: new Date()
  }));

  const entries = getAllEntries().map((e) => ({
    url: `${siteUrl}/${e.collection}/${e.frontmatter.slug}`,
    lastModified: e.frontmatter.updatedDate || e.frontmatter.publishDate
  }));

  return [...staticPages, ...entries];
}

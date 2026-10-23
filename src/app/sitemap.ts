import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";

const legalPages = ["/terms", "/privacy", "/dmca"];

const sitemap = (): MetadataRoute.Sitemap => [
  {
    url: siteConfig.url,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 1,
  },
  ...legalPages.map((path) => ({
    url: `${siteConfig.url}${path}`,
    lastModified: new Date(),
    changeFrequency: "yearly" as const,
    priority: 0.3,
  })),
];

export default sitemap;

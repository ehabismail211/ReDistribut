import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site-url";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteUrl();
  const now = new Date();
  const pages = [
    ["", 1],
    ["/how-it-works", 0.9],
    ["/suppliers", 0.86],
    ["/recipients", 0.86],
    ["/faq", 0.74],
    ["/contact", 0.8],
    ["/terms", 0.44],
    ["/privacy", 0.44],
  ] as const;

  return pages.map(([path, priority]) => ({
    url: `${baseUrl}${path}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority,
  }));
}

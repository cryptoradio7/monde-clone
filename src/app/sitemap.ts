import { MetadataRoute } from "next";
import db from "@/lib/db";
import { RUBRIQUES } from "@/lib/utils";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const articles = await db.article.findMany({
    select: { slug: true, updatedAt: true },
    orderBy: { publishedAt: "desc" },
  });

  const articleUrls = articles.map((a) => ({
    url: `${BASE_URL}/article/${a.slug}`,
    lastModified: a.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const rubriqueUrls = RUBRIQUES.map((r) => ({
    url: `${BASE_URL}/rubrique/${r.toLowerCase()}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.6,
  }));

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 1.0,
    },
    ...rubriqueUrls,
    ...articleUrls,
  ];
}

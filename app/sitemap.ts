import type { MetadataRoute } from "next"
import { site } from "@/content/site"
import { getCatalogo } from "@/content/produtos"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const catalogo = await getCatalogo()

  return [
    { url: site.url, changeFrequency: "weekly", priority: 1 },
    { url: `${site.url}/sobre`, changeFrequency: "yearly", priority: 0.5 },
    ...catalogo.map((p) => ({
      url: `${site.url}/p/${p.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ]
}

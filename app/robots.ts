import type { MetadataRoute } from "next"
import { site } from "@/content/site"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // /ir/ é rota de saída rastreada, não conteúdo. Indexá-la
      // desperdiça crawl e pode colocar um link de afiliado no índice.
      disallow: "/ir/",
    },
    sitemap: `${site.url}/sitemap.xml`,
  }
}

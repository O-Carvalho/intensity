import type { Metadata } from "next"
import { site } from "@/content/site"

type PageSeoInput = {
  titulo: string
  descricao?: string
  caminho?: string
  imagem?: string
}

/** O canal é o WhatsApp, e o que converte no grupo é o preview do link.
 *  Toda página precisa de título, descrição e imagem próprios — por isso
 *  `imagem` é parâmetro, não constante. */
export function buildMetadata({
  titulo,
  descricao,
  caminho = "",
  imagem,
}: PageSeoInput): Metadata {
  const url = `${site.url}${caminho}`
  const descricaoFinal = descricao ?? site.descricaoSeo
  const imagemFinal = imagem
    ? imagem.startsWith("http")
      ? imagem
      : `${site.url}${imagem}`
    : `${site.url}/og-default.png`

  return {
    title: titulo,
    description: descricaoFinal,
    alternates: { canonical: url },
    openGraph: {
      title: titulo,
      description: descricaoFinal,
      url,
      siteName: site.nome,
      locale: "pt_BR",
      type: "website",
      images: [{ url: imagemFinal }],
    },
    twitter: {
      card: "summary_large_image",
      title: titulo,
      description: descricaoFinal,
      images: [imagemFinal],
    },
  }
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: site.nome,
    description: site.descricaoSeo,
    url: site.url,
    inLanguage: "pt-BR",
  }
}

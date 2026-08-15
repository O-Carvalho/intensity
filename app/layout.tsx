import type { Metadata } from "next"
import { Archivo, IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google"
import { MotionConfig } from "motion/react"
import { Header } from "@/components/sections/header"
import { Footer } from "@/components/sections/footer"
import { buildMetadata, websiteJsonLd } from "@/lib/seo"
import { jsonParaScript } from "@/lib/analytics"
import { site } from "@/content/site"
import "@/theme/tokens.css"

const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-archivo",
  display: "swap",
})

const plexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex-sans",
  display: "swap",
})

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["500"],
  variable: "--font-plex-mono",
  display: "swap",
})

export const metadata: Metadata = {
  ...buildMetadata({ titulo: site.tituloSeo }),
  metadataBase: new URL(site.url),
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="pt-BR"
      className={`${archivo.variable} ${plexSans.variable} ${plexMono.variable}`}
    >
      <body className="flex min-h-dvh flex-col bg-bg font-body text-text antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonParaScript(websiteJsonLd()) }}
        />
        {/* [PENDENTE] Sem NEXT_PUBLIC_GA_ID nenhum script de analytics é
            carregado — o site funciona igual, só não mede. Setar a
            variável na Vercel liga os três eventos de uma vez.

            Este script — não o componente <GoogleAnalytics> de
            @next/third-parties — define `gtag` de propósito: aquele
            componente injeta o stub via useEffect, ou seja, só depois da
            hidratação. A página /ir/[slug] dispara select_item num
            <script> que roda ANTES da hidratação (é HTML puro, executa na
            hora que o navegador encontra a tag) — com o stub só chegando
            depois, `typeof gtag` nunca seria "function" a tempo e o evento
            mais importante do projeto (spec §8) nunca dispararia. Por ser
            uma tag <script> comum, renderizada ANTES de {"{children}"},
            este bloco executa antes de qualquer script de página — a
            fila (`dataLayer`) já existe no instante em que qualquer
            evento é chamado, mesmo que o gtag.js real ainda esteja
            carregando (`async`, não bloqueia o parse). */}
        {process.env.NEXT_PUBLIC_GA_ID && (
          <>
            <script
              dangerouslySetInnerHTML={{
                __html: `window.dataLayer=window.dataLayer||[];function gtag(){window.dataLayer.push(arguments);}gtag('js',new Date());gtag('config',${jsonParaScript(process.env.NEXT_PUBLIC_GA_ID)});`,
              }}
            />
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
            />
          </>
        )}
        <MotionConfig reducedMotion="user">
          <Header />
          <div className="flex-1">{children}</div>
          <Footer />
        </MotionConfig>
      </body>
    </html>
  )
}

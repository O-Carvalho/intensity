import type { Metadata } from "next"
import { Archivo, IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google"
import { MotionConfig } from "motion/react"
import { GoogleAnalytics } from "@next/third-parties/google"
import { Header } from "@/components/sections/header"
import { Footer } from "@/components/sections/footer"
import { buildMetadata, websiteJsonLd } from "@/lib/seo"
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
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd()) }}
        />
        <MotionConfig reducedMotion="user">
          <Header />
          <div className="flex-1">{children}</div>
          <Footer />
        </MotionConfig>
        {/* [PENDENTE] Sem NEXT_PUBLIC_GA_ID nenhum script de analytics é
            carregado — o site funciona igual, só não mede. Setar a
            variável na Vercel liga os três eventos de uma vez. */}
        {process.env.NEXT_PUBLIC_GA_ID && (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
        )}
      </body>
    </html>
  )
}

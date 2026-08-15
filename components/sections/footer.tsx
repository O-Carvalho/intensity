import Link from "next/link"
import { Container } from "@/components/ui/container"
import { BackToTop } from "@/components/ui/back-to-top"
import { MicroRotulo } from "@/components/ui/micro-rotulo"
import { site } from "@/content/site"
import { home } from "@/content/home"

export function Footer() {
  return (
    <footer className="mt-24 border-t border-line py-10">
      <Container className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-2">
          {/* Transparência sobre comissão não é linha jurídica: em grupo
              fechado, onde todo mundo se conhece, ela aumenta confiança. */}
          <p className="max-w-md text-sm text-text-muted">
            {home.rodape.transparencia}
          </p>
          <MicroRotulo>
            {site.nome} · {new Date().getFullYear()}
          </MicroRotulo>
        </div>

        <div className="flex items-center gap-4">
          {site.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="font-mono text-xs uppercase tracking-[0.14em] text-aco transition-colors hover:text-text"
            >
              {item.label}
            </Link>
          ))}
          <BackToTop />
        </div>
      </Container>
    </footer>
  )
}

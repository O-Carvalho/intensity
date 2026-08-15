import Link from "next/link"
import { Container } from "@/components/ui/container"
import { Logo } from "@/components/ui/logo"
import { MicroRotulo } from "@/components/ui/micro-rotulo"
import { MobileNav } from "@/components/ui/mobile-nav"
import { site } from "@/content/site"

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-line bg-bg/90 backdrop-blur">
      <Container className="relative flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-3" aria-label={site.nome}>
          <Logo />
        </Link>

        <div className="flex items-center gap-6">
          <MicroRotulo className="hidden sm:inline">{site.tagline}</MicroRotulo>
          <nav className="hidden gap-6 sm:flex">
            {site.nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="font-mono text-xs uppercase tracking-[0.14em] text-text-muted transition-colors hover:text-text"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <MobileNav nav={site.nav} />
        </div>
      </Container>
    </header>
  )
}

import { Container } from "@/components/ui/container"
import { MicroRotulo } from "@/components/ui/micro-rotulo"
import { Button } from "@/components/ui/button"
import { buildMetadata } from "@/lib/seo"
import { home } from "@/content/home"
import { linkWhatsapp, site } from "@/content/site"

export const metadata = buildMetadata({
  titulo: `${home.sobre.titulo} — ${site.nome}`,
  caminho: "/sobre",
})

export default function Page() {
  const whats = linkWhatsapp()

  return (
    <main className="py-16">
      <Container className="flex max-w-2xl flex-col gap-6">
        <MicroRotulo>{home.sobre.eyebrow}</MicroRotulo>
        <h1 className="display-expandido text-4xl text-text sm:text-5xl">
          {home.sobre.titulo}
        </h1>

        {/* [PENDENTE] Enquanto home.sobre.texto for null, esta página não
            inventa biografia — mostra só a nota de transparência, que é
            fato confirmado. Escrever uma história plausível aqui seria
            exatamente o tipo de fato inventado que não fazemos. */}
        {home.sobre.texto && (
          <p className="whitespace-pre-line text-lg text-text-muted">
            {home.sobre.texto}
          </p>
        )}

        <div className="border-l-2 border-oxido pl-4">
          <p className="text-text">{home.rodape.transparencia}</p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button href="/">{home.sobre.ctaCatalogo}</Button>
          {whats && (
            <Button href={whats} variant="ghost" external>
              {home.sobre.ctaContato}
            </Button>
          )}
        </div>
      </Container>
    </main>
  )
}

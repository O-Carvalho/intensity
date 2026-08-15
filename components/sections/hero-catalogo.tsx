import { Container } from "@/components/ui/container"
import { MicroRotulo } from "@/components/ui/micro-rotulo"
import { home } from "@/content/home"

export function HeroCatalogo({
  produtos,
  categorias,
}: {
  produtos: number
  categorias: number
}) {
  return (
    <section className="border-b border-line py-16 sm:py-24">
      <Container className="flex flex-col gap-6">
        <MicroRotulo>{home.hero.eyebrow}</MicroRotulo>

        <h1 className="display-expandido text-5xl text-text sm:text-7xl">
          {home.hero.linhas.map((linha) => (
            <span key={linha} className="block">
              {linha === home.hero.destaque ? (
                <span className="text-oxido">{linha}</span>
              ) : (
                linha
              )}
            </span>
          ))}
        </h1>

        {/* O resumo do catálogo é um dado, então é apresentado como dado:
            fio óxido curto + contagem em mono aço. Não há ornamento que
            não seja informação. */}
        <div className="flex items-center gap-3">
          <span aria-hidden="true" className="h-px w-10 bg-oxido" />
          <MicroRotulo>{home.catalogo.resumo(produtos, categorias)}</MicroRotulo>
        </div>
      </Container>
    </section>
  )
}

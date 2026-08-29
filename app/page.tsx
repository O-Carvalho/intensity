import { Container } from "@/components/ui/container"
import { HeroCatalogo } from "@/components/sections/hero-catalogo"
import { CatalogoClient } from "@/components/catalogo/catalogo-client"
import { ProdutoCard } from "@/components/catalogo/produto-card"
import { buildMetadata } from "@/lib/seo"
import { site } from "@/content/site"
import { home } from "@/content/home"
import { getCatalogo, getCategoriasEmUso, getDestaques } from "@/content/produtos"

export const metadata = buildMetadata({ titulo: site.tituloSeo })

export default async function Page() {
  const [catalogo, destaques, categorias] = await Promise.all([
    getCatalogo(),
    getDestaques(),
    getCategoriasEmUso(),
  ])

  return (
    <main>
      <HeroCatalogo produtos={catalogo.length} categorias={categorias.length} />

      {destaques.length > 0 && (
        <section className="border-b border-line bg-panel py-16">
          <Container className="flex flex-col gap-8">
            <h2 className="display-expandido text-2xl text-text">
              {home.catalogo.tituloDestaques}
            </h2>
            <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {destaques.map((produto, i) => (
                <li key={produto.slug} className="flex">
                  <ProdutoCard produto={produto} indice={i} elevado />
                </li>
              ))}
            </ul>
          </Container>
        </section>
      )}

      <CatalogoClient produtos={catalogo} categorias={categorias} />
    </main>
  )
}

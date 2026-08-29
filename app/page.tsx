import { Container } from "@/components/ui/container"
import { HeroCatalogo } from "@/components/sections/hero-catalogo"
import { CatalogoClient } from "@/components/catalogo/catalogo-client"
import { ProdutoCard } from "@/components/catalogo/produto-card"
import { buildMetadata } from "@/lib/seo"
import { primeiroValor, queryParaSelecao } from "@/lib/filtros"
import { site } from "@/content/site"
import { home } from "@/content/home"
import {
  getCatalogo,
  getCategoriasEmUso,
  getDestaques,
  getPlataformasEmUso,
} from "@/content/produtos"

export const metadata = buildMetadata({ titulo: site.tituloSeo })

/** Ler `searchParams` aqui, no servidor, e passar a seleção já resolvida
 *  por props evita `useSearchParams` no cliente — que exigiria uma
 *  fronteira <Suspense> e renderizaria a grade toda no cliente, tirando os
 *  produtos do HTML inicial. O custo é a página virar dinâmica; o fetch da
 *  planilha continua cacheado por 5 minutos. */
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const [catalogo, destaques, categorias, plataformas, query] = await Promise.all([
    getCatalogo(),
    getDestaques(),
    getCategoriasEmUso(),
    getPlataformasEmUso(),
    searchParams,
  ])

  const selecaoInicial = queryParaSelecao(
    {
      categoria: primeiroValor(query.categoria),
      loja: primeiroValor(query.loja),
    },
    { categoria: categorias, loja: plataformas },
  )

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

      <CatalogoClient
        produtos={catalogo}
        categorias={categorias}
        plataformas={plataformas}
        selecaoInicial={selecaoInicial}
      />
    </main>
  )
}

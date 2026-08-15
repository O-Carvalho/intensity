import { Container } from "@/components/ui/container"
import { ProdutoCard } from "@/components/catalogo/produto-card"
import { home } from "@/content/home"
import type { Produto } from "@/content/produtos"

export function Relacionados({ produtos }: { produtos: Produto[] }) {
  if (produtos.length === 0) return null

  return (
    <section className="border-t border-line py-16">
      <Container className="flex flex-col gap-8">
        <h2 className="display-expandido text-xl text-text">
          {home.produto.tituloRelacionados}
        </h2>
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {produtos.map((produto, i) => (
            <li key={produto.slug} className="flex">
              <ProdutoCard produto={produto} indice={i} />
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}

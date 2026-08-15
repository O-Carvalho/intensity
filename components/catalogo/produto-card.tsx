import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { FichaTecnica } from "@/components/produto/ficha-tecnica"
import { ProdutoImagem } from "@/components/ui/produto-imagem"
import { MicroRotulo } from "@/components/ui/micro-rotulo"
import { home } from "@/content/home"
import type { Produto } from "@/content/produtos"

/** Card do catálogo: imagem, nome em display expandido e ficha técnica
 *  reduzida (marca + porção). Sem preço, nunca — o Diogo não manteria 15
 *  preços atualizados, e preço errado destrói confiança mais rápido do
 *  que preço ausente afasta cliente.
 *
 *  `indice` escalona a entrada em 40ms por card. Como a animação é
 *  puramente de entrada (não depende de scroll nem de estado), ela é CSS
 *  puro com delay inline — nenhum JS envolvido. */
export function ProdutoCard({ produto, indice }: { produto: Produto; indice: number }) {
  const linhas = [
    { rotulo: "Marca", valor: produto.marca },
    ...(produto.porcao ? [{ rotulo: "Porção", valor: produto.porcao }] : []),
  ]

  return (
    <Link
      href={`/p/${produto.slug}`}
      className="card-rotulo entrada-card flex h-full flex-col"
      style={{ animationDelay: `${indice * 40}ms` }}
    >
      <ProdutoImagem src={produto.imagem_url} alt={produto.nome} />

      <div className="flex flex-1 flex-col gap-4 border-t border-line p-4">
        <div className="flex flex-col gap-1.5">
          <MicroRotulo className="!text-oxido">{produto.categoria}</MicroRotulo>
          <h3 className="display-expandido text-lg text-text">{produto.nome}</h3>
        </div>

        <FichaTecnica linhas={linhas} className="mt-auto" />

        <span className="flex items-center gap-2 border-t border-line pt-3 font-mono text-xs uppercase tracking-[0.14em] text-oxido">
          <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          {home.produto.ctaLoja}
        </span>
      </div>
    </Link>
  )
}

"use client"

import { X } from "lucide-react"
import { home } from "@/content/home"
import type { Faceta, Selecao } from "@/lib/filtros"

/** Etiquetas dos filtros ativos, acima da grade.
 *
 *  É a maior falha do painel da Renner: lá, depois de aplicar, nada
 *  aparece na página, e para tirar UM filtro você é obrigado a reabrir o
 *  painel inteiro. Aqui cada filtro ativo sai com um clique.
 *
 *  Etiqueta usa fundo óxido com texto CARVÃO (4.96:1). Off-white sobre
 *  óxido daria 3.37:1 e falharia AA. */
export function ChipsAtivos({
  selecao,
  aoRemover,
  aoLimpar,
}: {
  selecao: Selecao
  aoRemover: (faceta: Faceta, valor: string) => void
  aoLimpar: () => void
}) {
  const itens: { faceta: Faceta; valor: string }[] = [
    ...selecao.categoria.map((valor) => ({ faceta: "categoria" as Faceta, valor })),
    ...selecao.loja.map((valor) => ({ faceta: "loja" as Faceta, valor })),
  ]

  if (itens.length === 0) return null

  return (
    <div
      role="group"
      aria-label={home.catalogo.filtrosAtivos}
      className="flex flex-wrap items-center gap-2"
    >
      {itens.map(({ faceta, valor }) => (
        <button
          key={`${faceta}:${valor}`}
          type="button"
          onClick={() => aoRemover(faceta, valor)}
          aria-label={home.catalogo.removerFiltro(valor)}
          className="flex items-center gap-2 border border-oxido bg-oxido px-3 py-1.5 font-mono text-xs uppercase tracking-[0.14em] text-bg transition-colors hover:bg-oxido-bright hover:border-oxido-bright"
        >
          {valor}
          <X className="h-3 w-3" aria-hidden="true" />
        </button>
      ))}

      <button
        type="button"
        onClick={aoLimpar}
        className="border border-line px-3 py-1.5 font-mono text-xs uppercase tracking-[0.14em] text-aco transition-colors hover:border-aco hover:text-text"
      >
        {home.catalogo.limparTudo}
      </button>
    </div>
  )
}

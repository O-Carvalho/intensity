"use client"

import type { Categoria } from "@/content/produtos"
import { home } from "@/content/home"

export type FiltroCategoria = Categoria | "todos"

/** Chips de categoria: botões de verdade, com scroll horizontal no mobile.
 *  São <button>, não :hover nem CSS-only — o público é majoritariamente
 *  touch, e filtro que só responde a mouse é filtro quebrado.
 *
 *  Chip selecionado usa fundo óxido com texto CARVÃO (4.96:1). Texto
 *  off-white sobre óxido daria 3.37:1 e falharia AA. */
export function ChipsCategoria({
  categorias,
  selecionada,
  onSelecionar,
}: {
  categorias: readonly Categoria[]
  selecionada: FiltroCategoria
  onSelecionar: (c: FiltroCategoria) => void
}) {
  const opcoes: { valor: FiltroCategoria; label: string }[] = [
    { valor: "todos", label: home.catalogo.labelTodos },
    ...categorias.map((c) => ({ valor: c as FiltroCategoria, label: c })),
  ]

  return (
    <div
      role="group"
      aria-label={home.catalogo.labelFiltroCategoria}
      className="-mx-6 flex gap-2 overflow-x-auto px-6 pb-1"
    >
      {opcoes.map((opcao) => {
        const ativa = opcao.valor === selecionada
        return (
          <button
            key={opcao.valor}
            type="button"
            aria-pressed={ativa}
            onClick={() => onSelecionar(opcao.valor)}
            className={`shrink-0 border px-4 py-2 font-mono text-xs uppercase tracking-[0.14em] transition-colors ${
              ativa
                ? "border-oxido bg-oxido text-bg"
                : "border-line text-aco hover:border-aco hover:text-text"
            }`}
          >
            {opcao.label}
          </button>
        )
      })}
    </div>
  )
}

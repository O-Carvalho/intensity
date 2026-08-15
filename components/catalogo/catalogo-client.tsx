"use client"

import { useMemo, useState } from "react"
import { Search } from "lucide-react"
import { ChipsCategoria, type FiltroCategoria } from "@/components/catalogo/chips-categoria"
import { ProdutoCard } from "@/components/catalogo/produto-card"
import { Container } from "@/components/ui/container"
import { normalizarBusca } from "@/lib/format"
import { home } from "@/content/home"
import type { Categoria, Produto } from "@/content/produtos"

/** Filtro e busca acontecem em memória, sobre a lista que já chegou por
 *  props. Com 15 produtos não há motivo para ir ao servidor a cada tecla —
 *  e o catálogo continua respondendo instantaneamente em 4G ruim. */
export function CatalogoClient({
  produtos,
  categorias,
}: {
  produtos: Produto[]
  categorias: readonly Categoria[]
}) {
  const [categoria, setCategoria] = useState<FiltroCategoria>("todos")
  const [busca, setBusca] = useState("")
  // A entrada escalonada é um efeito de carregamento único: toca quando a
  // página abre e não deve repetir a cada filtro. Por isso o gatilho nasce
  // dentro dos próprios handlers de categoria e busca — nunca de um
  // useEffect, que dispararia de novo no mount e geraria uma renderização
  // extra sem necessidade.
  const [interagiu, setInteragiu] = useState(false)

  const filtrados = useMemo(() => {
    const termo = normalizarBusca(busca)
    return produtos.filter((p) => {
      const casaCategoria = categoria === "todos" || p.categoria === categoria
      if (!casaCategoria) return false
      if (!termo) return true
      return normalizarBusca(`${p.nome} ${p.marca}`).includes(termo)
    })
  }, [produtos, categoria, busca])

  return (
    <section id="catalogo" className="py-16">
      <Container className="flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <h2 className="display-expandido text-2xl text-text">
            {home.catalogo.tituloTodos}
          </h2>

          <label className="flex items-center gap-3 border border-line bg-panel px-4 py-3 focus-within:border-aco">
            <Search className="h-4 w-4 shrink-0 text-aco" aria-hidden="true" />
            <span className="sr-only">{home.catalogo.placeholderBusca}</span>
            <input
              type="search"
              value={busca}
              onChange={(e) => {
                setInteragiu(true)
                setBusca(e.target.value)
              }}
              placeholder={home.catalogo.placeholderBusca}
              className="w-full bg-transparent font-mono text-xs uppercase tracking-[0.1em] text-text outline-none placeholder:text-aco"
            />
          </label>

          <ChipsCategoria
            categorias={categorias}
            selecionada={categoria}
            onSelecionar={(c) => {
              setInteragiu(true)
              setCategoria(c)
            }}
          />
        </div>

        {filtrados.length === 0 ? (
          <p className="border border-line bg-panel p-6 text-text-muted">
            {home.catalogo.semResultado}
          </p>
        ) : (
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtrados.map((produto, i) => (
              <li key={produto.slug} className="flex">
                <ProdutoCard produto={produto} indice={i} animar={!interagiu} />
              </li>
            ))}
          </ul>
        )}
      </Container>
    </section>
  )
}

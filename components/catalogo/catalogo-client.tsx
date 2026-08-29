"use client"

import { useMemo, useState } from "react"
import { Search, SlidersHorizontal } from "lucide-react"
import { ChipsAtivos } from "@/components/catalogo/chips-ativos"
import { PainelFiltros } from "@/components/catalogo/painel-filtros"
import { ProdutoCard } from "@/components/catalogo/produto-card"
import { Container } from "@/components/ui/container"
import { home } from "@/content/home"
import {
  SELECAO_VAZIA,
  alternarOpcao,
  contarAtivos,
  filtrarProdutos,
  removerOpcao,
  selecaoParaQuery,
  type Faceta,
  type Selecao,
} from "@/lib/filtros"
import type { Produto } from "@/content/produtos"

/** Filtro e busca acontecem em memória, sobre a lista que já chegou por
 *  props. Com poucas dezenas de produtos não há motivo para ir ao servidor
 *  a cada tecla — e o catálogo continua respondendo em 4G ruim.
 *
 *  A URL é reescrita com history.replaceState, não com router.replace: o
 *  segundo dispararia uma volta ao servidor a cada checkbox, e a página é
 *  dinâmica por ler searchParams. replaceState integra com o router do
 *  Next sem recarregar nada. */
export function CatalogoClient({
  produtos,
  categorias,
  plataformas,
  selecaoInicial,
}: {
  produtos: Produto[]
  categorias: readonly string[]
  plataformas: readonly string[]
  selecaoInicial: Selecao
}) {
  const [selecao, setSelecao] = useState<Selecao>(selecaoInicial)
  const [busca, setBusca] = useState("")
  const [painelAberto, setPainelAberto] = useState(false)
  // A entrada escalonada é um efeito de carregamento único: toca quando a
  // página abre e não deve repetir a cada filtro. Por isso o gatilho nasce
  // dentro dos próprios handlers — nunca de um useEffect, que dispararia
  // de novo no mount e geraria uma renderização extra sem necessidade.
  const [interagiu, setInteragiu] = useState(false)

  const filtrados = useMemo(
    () => filtrarProdutos(produtos, selecao, busca),
    [produtos, selecao, busca],
  )
  const ativos = contarAtivos(selecao)

  function aplicar(proxima: Selecao) {
    setInteragiu(true)
    setSelecao(proxima)
    const query = selecaoParaQuery(proxima)
    window.history.replaceState(
      null,
      "",
      query ? `?${query}` : window.location.pathname,
    )
  }

  return (
    <section id="catalogo" className="py-16">
      <Container className="flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <h2 className="display-expandido text-2xl text-text">
            {home.catalogo.tituloTodos}
          </h2>

          <div className="flex flex-col gap-3 sm:flex-row">
            <label className="flex flex-1 items-center gap-3 border border-line bg-panel px-4 py-3 focus-within:border-aco">
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

            <button
              type="button"
              onClick={() => setPainelAberto(true)}
              aria-expanded={painelAberto}
              aria-controls="painel-filtros"
              className="flex shrink-0 items-center justify-center gap-2 border border-line px-5 py-3 font-mono text-xs uppercase tracking-[0.14em] text-text transition-colors hover:border-aco"
            >
              <SlidersHorizontal className="h-4 w-4 text-aco" aria-hidden="true" />
              {home.catalogo.botaoFiltrar}
              {ativos > 0 && <span className="text-oxido">({ativos})</span>}
            </button>
          </div>

          <ChipsAtivos
            selecao={selecao}
            aoRemover={(faceta: Faceta, valor: string) => aplicar(removerOpcao(selecao, faceta, valor))}
            aoLimpar={() => aplicar(SELECAO_VAZIA)}
          />

          <p aria-live="polite" className="micro-rotulo">
            {home.catalogo.contagemResultado(filtrados.length)}
          </p>
        </div>

        {filtrados.length === 0 ? (
          <div className="flex flex-col items-start gap-4 border border-line bg-panel p-6">
            <p className="text-text-muted">
              {ativos > 0 ? home.catalogo.semResultadoFiltro : home.catalogo.semResultadoBusca}
            </p>
            {ativos > 0 && (
              <button
                type="button"
                onClick={() => aplicar(SELECAO_VAZIA)}
                className="border border-line px-4 py-2 font-mono text-xs uppercase tracking-[0.14em] text-aco transition-colors hover:border-aco hover:text-text"
              >
                {home.catalogo.limparTudo}
              </button>
            )}
          </div>
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

      <PainelFiltros
        aberto={painelAberto}
        aoFechar={() => setPainelAberto(false)}
        produtos={produtos}
        selecao={selecao}
        termoBusca={busca}
        opcoesCategoria={categorias}
        opcoesPlataforma={plataformas}
        aoAlternar={(faceta: Faceta, valor: string) => aplicar(alternarOpcao(selecao, faceta, valor))}
        aoLimpar={() => aplicar(SELECAO_VAZIA)}
      />
    </section>
  )
}

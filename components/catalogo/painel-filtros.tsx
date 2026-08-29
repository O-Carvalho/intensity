"use client"

import { useEffect, useRef } from "react"
import { X } from "lucide-react"
import { home } from "@/content/home"
import { contarOpcoes, type Faceta, type Selecao } from "@/lib/filtros"
import type { Produto } from "@/content/produtos"

const FOCAVEIS =
  'button:not([disabled]), input:not([disabled]), [href], [tabindex]:not([tabindex="-1"])'

/** Gaveta de filtros.
 *
 *  Copia da Renner o que funciona — gaveta da direita com scrim, trava de
 *  scroll, resumo dos escolhidos no cabeçalho da seção — e corrige o que
 *  não funciona: lá as seções são sanfona de abertura única (faz sentido
 *  com 7 facetas, não com 2), existe um botão "Aplicar" (desnecessário
 *  com o catálogo inteiro em memória), e não há acessibilidade nenhuma —
 *  sem role=dialog, sem Esc, sem foco, cabeçalhos em <div>.
 *
 *  Fica sempre montada e sai de cena por transform, para a transição
 *  valer também na saída. `inert` tira o conteúdo do foco enquanto
 *  fechada — sem isso o Tab entraria numa gaveta invisível. */
export function PainelFiltros({
  aberto,
  aoFechar,
  produtos,
  selecao,
  termoBusca,
  opcoesCategoria,
  opcoesPlataforma,
  aoAlternar,
  aoLimpar,
}: {
  aberto: boolean
  aoFechar: () => void
  produtos: Produto[]
  selecao: Selecao
  termoBusca: string
  opcoesCategoria: readonly string[]
  opcoesPlataforma: readonly string[]
  aoAlternar: (faceta: Faceta, valor: string) => void
  aoLimpar: () => void
}) {
  const painelRef = useRef<HTMLDivElement>(null)

  // Efeito de DOM, não de estado: trava o scroll do fundo, joga o foco
  // para dentro da gaveta e o devolve ao gatilho ao fechar.
  useEffect(() => {
    if (!aberto) return
    const gatilho = document.activeElement as HTMLElement | null
    const scrollAnterior = document.body.style.overflow
    document.body.style.overflow = "hidden"
    painelRef.current?.focus()
    return () => {
      document.body.style.overflow = scrollAnterior
      gatilho?.focus()
    }
  }, [aberto])

  function aoTeclar(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key === "Escape") {
      aoFechar()
      return
    }
    if (e.key !== "Tab") return
    const focaveis = painelRef.current?.querySelectorAll<HTMLElement>(FOCAVEIS)
    if (!focaveis || focaveis.length === 0) return
    const primeiro = focaveis[0]
    const ultimo = focaveis[focaveis.length - 1]
    if (e.shiftKey && document.activeElement === primeiro) {
      e.preventDefault()
      ultimo.focus()
    } else if (!e.shiftKey && document.activeElement === ultimo) {
      e.preventDefault()
      primeiro.focus()
    }
  }

  return (
    <>
      <div
        onClick={aoFechar}
        aria-hidden="true"
        className={`fixed inset-0 z-[60] bg-bg/70 transition-opacity duration-300 ${
          aberto ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <div
        ref={painelRef}
        id="painel-filtros"
        role="dialog"
        aria-modal="true"
        aria-labelledby="painel-filtros-titulo"
        tabIndex={-1}
        inert={!aberto}
        onKeyDown={aoTeclar}
        className={`fixed right-0 top-0 z-[70] flex h-full w-full max-w-[420px] flex-col border-l border-line bg-panel transition-transform duration-300 ${
          aberto ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-line px-6 py-5">
          <h2
            id="painel-filtros-titulo"
            className="display-expandido text-xl text-text"
          >
            {home.catalogo.tituloPainel}
          </h2>
          <button
            type="button"
            onClick={aoFechar}
            aria-label={home.catalogo.fecharPainel}
            className="p-1 text-aco transition-colors hover:text-text"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6">
          <SecaoFaceta
            titulo={home.catalogo.secaoCategoria}
            faceta="categoria"
            opcoes={opcoesCategoria}
            selecionados={selecao.categoria}
            contagens={contarOpcoes(produtos, selecao, "categoria", termoBusca)}
            aoAlternar={aoAlternar}
          />
          <SecaoFaceta
            titulo={home.catalogo.secaoPlataforma}
            faceta="loja"
            opcoes={opcoesPlataforma}
            selecionados={selecao.loja}
            contagens={contarOpcoes(produtos, selecao, "loja", termoBusca)}
            aoAlternar={aoAlternar}
          />
        </div>

        <div className="border-t border-line px-6 py-5 shadow-[0_-8px_16px_rgba(0,0,0,0.25)]">
          <button
            type="button"
            onClick={aoLimpar}
            className="w-full border border-line px-4 py-3 font-mono text-xs uppercase tracking-[0.14em] text-aco transition-colors hover:border-aco hover:text-text"
          >
            {home.catalogo.limparTudo}
          </button>
        </div>
      </div>
    </>
  )
}

/** Uma faceta. Sempre aberta: com duas seções curtas, esconder conteúdo
 *  atrás de sanfona só acrescenta clique. O resumo dos escolhidos no
 *  cabeçalho é o melhor detalhe do painel da Renner. */
function SecaoFaceta({
  titulo,
  faceta,
  opcoes,
  selecionados,
  contagens,
  aoAlternar,
}: {
  titulo: string
  faceta: Faceta
  opcoes: readonly string[]
  selecionados: string[]
  contagens: Map<string, number>
  aoAlternar: (faceta: Faceta, valor: string) => void
}) {
  return (
    <fieldset className="border-b border-line py-5 last:border-b-0">
      <legend className="micro-rotulo">
        {titulo}
        {selecionados.length > 0 && (
          <span className="text-oxido"> · {selecionados.join(", ")}</span>
        )}
      </legend>

      <div className="mt-4 flex flex-col">
        {opcoes.map((opcao) => {
          const quantos = contagens.get(opcao) ?? 0
          const marcado = selecionados.includes(opcao)
          const desabilitado = quantos === 0 && !marcado
          return (
            <label
              key={opcao}
              className={`flex items-center gap-3 py-2 text-sm ${
                desabilitado ? "cursor-not-allowed text-text-dim" : "cursor-pointer text-text"
              }`}
            >
              <input
                type="checkbox"
                checked={marcado}
                disabled={desabilitado}
                onChange={() => aoAlternar(faceta, opcao)}
                className="h-4 w-4 shrink-0 accent-oxido"
              />
              <span className="flex-1">{opcao}</span>
              <span className="font-mono text-xs text-aco">({quantos})</span>
            </label>
          )
        })}
      </div>
    </fieldset>
  )
}

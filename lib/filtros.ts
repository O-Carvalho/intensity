import { normalizarBusca } from "@/lib/format"
import type { Produto } from "@/content/produtos"

/** Os dois eixos de filtro. "loja" é o apelido curto de `plataforma` —
 *  ele aparece na URL, que é feita para ser colada em grupo de WhatsApp. */
export type Faceta = "categoria" | "loja"

/** Guarda os valores REAIS ("Pré-treino", "Mercado Livre"), não slugs.
 *  Slug existe só na fronteira da URL, em selecaoParaQuery/queryParaSelecao. */
export type Selecao = { categoria: string[]; loja: string[] }

export type OpcoesConhecidas = {
  categoria: readonly string[]
  loja: readonly string[]
}

export const SELECAO_VAZIA: Selecao = { categoria: [], loja: [] }

const FACETAS: Faceta[] = ["categoria", "loja"]

function valorDaFaceta(produto: Produto, faceta: Faceta): string {
  return faceta === "categoria" ? produto.categoria : produto.plataforma
}

/** Slug de URL: minúsculo, sem acento, tudo que não é letra/número vira
 *  hífen. Reaproveita normalizarBusca para não ter duas definições de
 *  "sem acento" no projeto. */
export function slugificar(texto: string): string {
  return normalizarBusca(texto)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

/** OU dentro da faceta: nada marcado passa tudo; algo marcado passa quem
 *  bate com QUALQUER um dos marcados. */
function casaFaceta(produto: Produto, faceta: Faceta, selecao: Selecao): boolean {
  const escolhidos = selecao[faceta]
  if (escolhidos.length === 0) return true
  return escolhidos.includes(valorDaFaceta(produto, faceta))
}

/** E entre facetas, E com a busca. */
export function filtrarProdutos(
  produtos: Produto[],
  selecao: Selecao,
  termoBusca: string,
): Produto[] {
  const termo = normalizarBusca(termoBusca)
  return produtos.filter((produto) => {
    if (!FACETAS.every((f) => casaFaceta(produto, f, selecao))) return false
    if (!termo) return true
    return normalizarBusca(`${produto.nome} ${produto.marca}`).includes(termo)
  })
}

/** Quantos produtos cada opção da faceta renderia.
 *
 *  A contagem considera as outras facetas e a busca, mas NÃO a seleção da
 *  própria faceta — senão, marcada uma opção, todas as outras iriam a zero
 *  e a contagem deixaria de informar qualquer coisa. É o comportamento
 *  padrão de facetas. */
export function contarOpcoes(
  produtos: Produto[],
  selecao: Selecao,
  faceta: Faceta,
  termoBusca: string,
): Map<string, number> {
  const semAPropria: Selecao = { ...selecao, [faceta]: [] }
  const contagem = new Map<string, number>()
  for (const produto of filtrarProdutos(produtos, semAPropria, termoBusca)) {
    const valor = valorDaFaceta(produto, faceta)
    contagem.set(valor, (contagem.get(valor) ?? 0) + 1)
  }
  return contagem
}

export function contarAtivos(selecao: Selecao): number {
  return selecao.categoria.length + selecao.loja.length
}

export function alternarOpcao(
  selecao: Selecao,
  faceta: Faceta,
  valor: string,
): Selecao {
  const atuais = selecao[faceta]
  return {
    ...selecao,
    [faceta]: atuais.includes(valor)
      ? atuais.filter((v) => v !== valor)
      : [...atuais, valor],
  }
}

export function removerOpcao(
  selecao: Selecao,
  faceta: Faceta,
  valor: string,
): Selecao {
  return { ...selecao, [faceta]: selecao[faceta].filter((v) => v !== valor) }
}

export function selecaoParaQuery(selecao: Selecao): string {
  const params = new URLSearchParams()
  for (const faceta of FACETAS) {
    const valores = selecao[faceta]
    if (valores.length > 0) params.set(faceta, valores.map(slugificar).join(","))
  }
  return params.toString()
}

/** Casa cada slug contra as opções que existem hoje. Slug desconhecido é
 *  descartado em silêncio: link antigo compartilhado em grupo nunca pode
 *  quebrar a página, mesmo depois de a loja sair do catálogo. */
function casarSlugs(bruto: string | undefined, conhecidas: readonly string[]): string[] {
  if (!bruto) return []
  const porSlug = new Map(conhecidas.map((valor) => [slugificar(valor), valor]))
  const achados: string[] = []
  for (const slug of bruto.split(",")) {
    const valor = porSlug.get(slug.trim())
    if (valor !== undefined && !achados.includes(valor)) achados.push(valor)
  }
  return achados
}

export function queryParaSelecao(
  query: { categoria?: string; loja?: string },
  opcoes: OpcoesConhecidas,
): Selecao {
  return {
    categoria: casarSlugs(query.categoria, opcoes.categoria),
    loja: casarSlugs(query.loja, opcoes.loja),
  }
}

/** `searchParams` entrega `string | string[] | undefined`. Repetiu o
 *  parâmetro na URL, o primeiro vale. */
export function primeiroValor(
  v: string | string[] | undefined,
): string | undefined {
  return Array.isArray(v) ? v[0] : v
}

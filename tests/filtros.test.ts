import { describe, expect, it } from "vitest"
import type { Produto } from "@/content/produtos"
import {
  SELECAO_VAZIA,
  alternarOpcao,
  contarAtivos,
  contarOpcoes,
  filtrarProdutos,
  primeiroValor,
  queryParaSelecao,
  removerOpcao,
  selecaoParaQuery,
  slugificar,
} from "@/lib/filtros"

function p(over: Partial<Produto> = {}): Produto {
  return {
    slug: "whey-growth",
    nome: "Whey Protein",
    marca: "Growth",
    categoria: "Proteína",
    porcao: undefined,
    imagem_url: "/produtos/placeholder.png",
    descricao_curta: "a".repeat(60),
    beneficio: undefined,
    link_afiliado: "https://exemplo.com.br/x",
    plataforma: "Growth",
    destaque: "N",
    ativo: "S",
    ...over,
  }
}

const catalogo: Produto[] = [
  p({ slug: "a", categoria: "Proteína", plataforma: "Growth" }),
  p({ slug: "b", categoria: "Creatina", plataforma: "Growth" }),
  p({ slug: "c", categoria: "Creatina", plataforma: "Amazon" }),
  p({ slug: "d", categoria: "Termogênico", plataforma: "Amazon", nome: "Thermo", marca: "Probiótica" }),
]

describe("filtrarProdutos", () => {
  it("sem seleção devolve tudo", () => {
    expect(filtrarProdutos(catalogo, SELECAO_VAZIA, "")).toHaveLength(4)
  })

  it("OU dentro da mesma faceta: somar categoria AUMENTA o resultado", () => {
    const uma = { ...SELECAO_VAZIA, categoria: ["Creatina"] }
    const duas = { ...SELECAO_VAZIA, categoria: ["Creatina", "Proteína"] }
    expect(filtrarProdutos(catalogo, uma, "")).toHaveLength(2)
    expect(filtrarProdutos(catalogo, duas, "")).toHaveLength(3)
  })

  it("E entre facetas: categoria + loja é interseção estrita", () => {
    const s = { categoria: ["Creatina"], loja: ["Amazon"] }
    const r = filtrarProdutos(catalogo, s, "")
    expect(r).toHaveLength(1)
    expect(r[0].slug).toBe("c")
  })

  it("a busca combina com os filtros por E, ignorando acento", () => {
    const s = { ...SELECAO_VAZIA, categoria: ["Termogênico"] }
    expect(filtrarProdutos(catalogo, s, "probiotica")).toHaveLength(1)
    expect(filtrarProdutos(catalogo, s, "growth")).toHaveLength(0)
  })

  it("pode legitimamente devolver zero", () => {
    expect(filtrarProdutos(catalogo, { categoria: ["Proteína"], loja: ["Amazon"] }, "")).toHaveLength(0)
  })
})

describe("contarOpcoes", () => {
  it("ignora a seleção da própria faceta", () => {
    const s = { ...SELECAO_VAZIA, categoria: ["Creatina"] }
    const c = contarOpcoes(catalogo, s, "categoria", "")
    expect(c.get("Proteína")).toBe(1)
    expect(c.get("Creatina")).toBe(2)
  })

  it("respeita a seleção das OUTRAS facetas", () => {
    const s = { ...SELECAO_VAZIA, loja: ["Amazon"] }
    const c = contarOpcoes(catalogo, s, "categoria", "")
    expect(c.get("Creatina")).toBe(1)
    expect(c.get("Proteína")).toBeUndefined()
  })

  it("respeita a busca", () => {
    const c = contarOpcoes(catalogo, SELECAO_VAZIA, "loja", "thermo")
    expect(c.get("Amazon")).toBe(1)
    expect(c.get("Growth")).toBeUndefined()
  })
})

describe("slugificar", () => {
  it("tira acento e troca espaço por hífen", () => {
    expect(slugificar("Pré-treino")).toBe("pre-treino")
    expect(slugificar("Mercado Livre")).toBe("mercado-livre")
    expect(slugificar("Proteína")).toBe("proteina")
  })
})

describe("URL", () => {
  const opcoes = {
    categoria: ["Proteína", "Creatina", "Pré-treino"],
    loja: ["Growth", "Mercado Livre"],
  }

  it("ida e volta preserva a seleção", () => {
    const s = { categoria: ["Pré-treino"], loja: ["Mercado Livre"] }
    const query = selecaoParaQuery(s)
    expect(query).toBe("categoria=pre-treino&loja=mercado-livre")
    expect(queryParaSelecao({ categoria: "pre-treino", loja: "mercado-livre" }, opcoes)).toEqual(s)
  })

  it("seleção vazia gera query vazia", () => {
    expect(selecaoParaQuery(SELECAO_VAZIA)).toBe("")
  })

  it("descarta slug desconhecido sem quebrar", () => {
    const s = queryParaSelecao({ categoria: "proteina,loja-que-sumiu" }, opcoes)
    expect(s.categoria).toEqual(["Proteína"])
    expect(s.loja).toEqual([])
  })

  it("descarta slug repetido", () => {
    expect(queryParaSelecao({ categoria: "proteina,proteina" }, opcoes).categoria)
      .toEqual(["Proteína"])
  })
})

describe("manipulação da seleção", () => {
  it("alternar adiciona e depois remove", () => {
    const um = alternarOpcao(SELECAO_VAZIA, "loja", "Amazon")
    expect(um.loja).toEqual(["Amazon"])
    expect(alternarOpcao(um, "loja", "Amazon").loja).toEqual([])
  })

  it("remover tira só o valor pedido", () => {
    const s = { categoria: ["Proteína", "Creatina"], loja: [] as string[] }
    expect(removerOpcao(s, "categoria", "Proteína").categoria).toEqual(["Creatina"])
  })

  it("contarAtivos soma as duas facetas", () => {
    expect(contarAtivos({ categoria: ["a", "b"], loja: ["c"] })).toBe(3)
    expect(contarAtivos(SELECAO_VAZIA)).toBe(0)
  })

  it("primeiroValor normaliza o que vem de searchParams", () => {
    expect(primeiroValor("a")).toBe("a")
    expect(primeiroValor(["a", "b"])).toBe("a")
    expect(primeiroValor(undefined)).toBeUndefined()
  })
})

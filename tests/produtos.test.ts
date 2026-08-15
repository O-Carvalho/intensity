import { describe, expect, it } from "vitest"
import { validarCatalogo } from "@/content/produtos"

function linha(over: Record<string, string> = {}): Record<string, string> {
  return {
    slug: "whey-concentrado-growth",
    nome: "Whey Protein Concentrado",
    marca: "Growth",
    categoria: "Proteína",
    porcao: "900 g",
    imagem_url: "/produtos/placeholder.png",
    descricao_curta:
      "Duas doses por dia fecham a proteína do dia sem pesar no bolso do treino.",
    beneficio: "Fecha a cota de proteína do dia",
    link_afiliado: "https://www.growthsupplements.com.br/produto?ref=diogo",
    destaque: "S",
    ativo: "S",
    ...over,
  }
}

describe("validarCatalogo", () => {
  it("aceita uma linha completa e válida", () => {
    const [p] = validarCatalogo([linha()])
    expect(p.slug).toBe("whey-concentrado-growth")
    expect(p.categoria).toBe("Proteína")
    expect(p.porcao).toBe("900 g")
  })

  it("aceita campos opcionais ausentes", () => {
    const [p] = validarCatalogo([linha({ porcao: "", beneficio: "" })])
    expect(p.porcao).toBeUndefined()
    expect(p.beneficio).toBeUndefined()
  })

  it("normaliza S/N em minúsculo ou com espaço", () => {
    const [p] = validarCatalogo([linha({ destaque: " s ", ativo: "n" })])
    expect(p.destaque).toBe("S")
    expect(p.ativo).toBe("N")
  })

  it("aponta LINHA e COLUNA da planilha quando o slug é inválido", () => {
    expect(() => validarCatalogo([linha(), linha({ slug: "Whey Growth" })]))
      .toThrow(/Linha 3.*"slug"/s)
  })

  it("aponta linha e coluna quando a categoria não existe", () => {
    expect(() => validarCatalogo([linha({ categoria: "Barrinha" })]))
      .toThrow(/Linha 2.*"categoria"/s)
  })

  it("aponta linha e coluna quando a descrição é curta demais", () => {
    expect(() => validarCatalogo([linha({ descricao_curta: "Curta." })]))
      .toThrow(/Linha 2.*"descricao_curta"/s)
  })

  it("rejeita link de afiliado que não seja http ou https", () => {
    expect(() => validarCatalogo([linha({ link_afiliado: "javascript:alert(1)" })]))
      .toThrow(/Linha 2.*"link_afiliado"/s)
  })

  it("rejeita slug duplicado apontando as duas linhas", () => {
    expect(() => validarCatalogo([linha(), linha({ nome: "Outro produto" })]))
      .toThrow(/slug.*repetido.*linha 2.*linha 3/is)
  })

  it("aceita imagem como URL https ou como caminho local", () => {
    expect(() =>
      validarCatalogo([linha({ imagem_url: "https://loja.com/whey.jpg" })]),
    ).not.toThrow()
    expect(() =>
      validarCatalogo([linha({ imagem_url: "/produtos/placeholder.png" })]),
    ).not.toThrow()
  })

  it("rejeita imagem em http puro", () => {
    expect(() => validarCatalogo([linha({ imagem_url: "http://loja.com/w.jpg" })]))
      .toThrow(/Linha 2.*"imagem_url"/s)
  })
})

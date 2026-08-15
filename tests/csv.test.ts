import { describe, expect, it } from "vitest"
import { parseCsv } from "@/lib/csv"

describe("parseCsv", () => {
  it("mapeia cada linha para um objeto com as chaves do cabeçalho", () => {
    const csv = "slug,nome\nwhey-growth,Whey Concentrado\ncreatina,Creatina"
    expect(parseCsv(csv)).toEqual([
      { slug: "whey-growth", nome: "Whey Concentrado" },
      { slug: "creatina", nome: "Creatina" },
    ])
  })

  it("preserva vírgula dentro de campo entre aspas", () => {
    const csv = 'slug,descricao\nwhey,"Proteína, sem enrolação"'
    expect(parseCsv(csv)[0].descricao).toBe("Proteína, sem enrolação")
  })

  it("desescapa aspas duplicadas dentro de campo entre aspas", () => {
    const csv = 'slug,nome\nwhey,"O ""melhor"" custo-benefício"'
    expect(parseCsv(csv)[0].nome).toBe('O "melhor" custo-benefício')
  })

  it("preserva quebra de linha dentro de campo entre aspas", () => {
    const csv = 'slug,descricao\nwhey,"linha um\nlinha dois"'
    expect(parseCsv(csv)[0].descricao).toBe("linha um\nlinha dois")
  })

  it("aceita CRLF como fim de linha", () => {
    const csv = "slug,nome\r\nwhey,Whey\r\ncreatina,Creatina"
    expect(parseCsv(csv)).toHaveLength(2)
    expect(parseCsv(csv)[1].nome).toBe("Creatina")
  })

  it("descarta linhas totalmente vazias, inclusive a final", () => {
    const csv = "slug,nome\nwhey,Whey\n\n"
    expect(parseCsv(csv)).toHaveLength(1)
  })

  it("remove espaços das pontas de cabeçalhos e valores", () => {
    const csv = " slug , nome \n whey , Whey Concentrado "
    expect(parseCsv(csv)).toEqual([{ slug: "whey", nome: "Whey Concentrado" }])
  })

  it("preenche com string vazia a coluna ausente no fim da linha", () => {
    const csv = "slug,nome,porcao\nwhey,Whey"
    expect(parseCsv(csv)[0].porcao).toBe("")
  })

  it("devolve lista vazia para texto sem nenhuma linha de dado", () => {
    expect(parseCsv("slug,nome")).toEqual([])
    expect(parseCsv("")).toEqual([])
  })
})

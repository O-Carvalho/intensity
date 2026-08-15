import { describe, expect, it } from "vitest"
import { jsonParaScript, scriptDeEvento } from "@/lib/analytics"

describe("jsonParaScript", () => {
  it("não deixa nenhum '<' na saída quando o valor contém uma tag de fechamento de script", () => {
    const valor = { nome: "Whey </script><script>alert(1)</script>" }
    const saida = jsonParaScript(valor)
    expect(saida.includes("<")).toBe(false)
  })

  it("não deixa o separador de linha U+2028 literal na saída", () => {
    const valor = { nome: "Whey Concentrado" }
    const saida = jsonParaScript(valor)
    expect(saida.includes(" ")).toBe(false)
  })

  it("não deixa o separador de parágrafo U+2029 literal na saída", () => {
    const valor = { nome: "Whey Concentrado" }
    const saida = jsonParaScript(valor)
    expect(saida.includes(" ")).toBe(false)
  })

  it("é transparente: avaliar a saída como JavaScript reproduz o valor original", () => {
    const valor = {
      nome: "Whey </script><script>alert(1)</script>",
      linha: "a b",
      paragrafo: "c d",
    }
    const saida = jsonParaScript(valor)
    // Reidrata a string como o navegador faria dentro do <script> inline.
    const reidratado = new Function("return " + saida)()
    expect(reidratado).toEqual(valor)
  })

  it("mantém um valor comum, sem caracteres especiais, inalterado", () => {
    const valor = { nome: "Creatina", quantidade: 300 }
    const saida = jsonParaScript(valor)
    expect(saida).toBe(JSON.stringify(valor))
  })
})

describe("scriptDeEvento", () => {
  it("escapa o item_name interpolado, mesmo quando ele traz uma tag de fechamento de script", () => {
    const script = scriptDeEvento({
      nome: "select_item",
      item_id: "whey-growth",
      item_name: "Whey </script><script>alert(1)</script>",
      item_brand: "Growth",
    })
    expect(script.includes("<")).toBe(false)
  })
})

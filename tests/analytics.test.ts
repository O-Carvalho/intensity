import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { jsonParaScript, scriptDeEvento, scriptDeRedirecionamento } from "@/lib/analytics"

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

// Roda o script produzido de verdade dentro de um sandbox — `gtag`,
// `location` e `setTimeout` são injetados como parâmetros de uma Function,
// então as chamadas soltas no script (não qualificadas) resolvem para o
// que o teste controla, sem tocar o ambiente real do Node.
function executar(
  script: string,
  gtag: unknown,
  location: { replace: (url: string) => void },
) {
  const fn = new Function("gtag", "location", "setTimeout", script)
  fn(gtag, location, setTimeout)
}

describe("scriptDeRedirecionamento", () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })
  afterEach(() => {
    vi.useRealTimers()
  })

  it("sem gtag configurado, navega mesmo assim quando o piso vence", () => {
    const replace = vi.fn()
    const script = scriptDeRedirecionamento(
      { nome: "select_item", item_id: "a", item_name: "A", item_brand: "Growth" },
      "https://loja.exemplo/a",
    )
    executar(script, undefined, { replace })
    expect(replace).not.toHaveBeenCalled()
    vi.advanceTimersByTime(400)
    expect(replace).toHaveBeenCalledWith("https://loja.exemplo/a")
  })

  it("com gtag confirmando o envio, navega antes do piso — sem esperar o timeout", () => {
    const replace = vi.fn()
    let callbackCapturado: (() => void) | undefined
    const gtagFalso = vi.fn((_cmd: string, _nome: string, params: { event_callback: () => void }) => {
      callbackCapturado = params.event_callback
    })
    const script = scriptDeRedirecionamento(
      { nome: "select_item", item_id: "a", item_name: "A", item_brand: "Growth" },
      "https://loja.exemplo/a",
    )
    executar(script, gtagFalso, { replace })
    expect(gtagFalso).toHaveBeenCalled()
    callbackCapturado?.()
    expect(replace).toHaveBeenCalledWith("https://loja.exemplo/a")
  })

  it("nunca navega duas vezes, mesmo se o callback do GA e o piso disparam os dois", () => {
    const replace = vi.fn()
    let callbackCapturado: (() => void) | undefined
    const gtagFalso = vi.fn((_cmd: string, _nome: string, params: { event_callback: () => void }) => {
      callbackCapturado = params.event_callback
    })
    const script = scriptDeRedirecionamento(
      { nome: "select_item", item_id: "a", item_name: "A", item_brand: "Growth" },
      "https://loja.exemplo/a",
    )
    executar(script, gtagFalso, { replace })
    callbackCapturado?.()
    vi.advanceTimersByTime(400)
    expect(replace).toHaveBeenCalledTimes(1)
  })

  it("escapa o item_name interpolado, mesmo quando ele traz uma tag de fechamento de script", () => {
    const script = scriptDeRedirecionamento(
      {
        nome: "select_item",
        item_id: "a",
        item_name: "Whey </script><script>alert(1)</script>",
        item_brand: "Growth",
      },
      "https://loja.exemplo/a",
    )
    expect(script.includes("<")).toBe(false)
  })

  it("escapa o link de destino interpolado", () => {
    const script = scriptDeRedirecionamento(
      { nome: "select_item", item_id: "a", item_name: "A", item_brand: "Growth" },
      "https://loja.exemplo/</script><script>alert(1)</script>",
    )
    expect(script.includes("<")).toBe(false)
  })
})

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { jsonParaScript, scriptDeRedirecionamento } from "@/lib/analytics"

describe("jsonParaScript", () => {
  it("não deixa nenhum '<' na saída quando o valor contém uma tag de fechamento de script", () => {
    const valor = { nome: "Whey </script><script>alert(1)</script>" }
    const saida = jsonParaScript(valor)
    expect(saida.includes("<")).toBe(false)
  })

  it("nao deixa o separador de linha U+2028 literal na saida", () => {
    // O nome do produto abaixo carrega o separador de linha real
    // (\u2028) via escape explicito no fonte -- nunca um caractere
    // literal colado aqui, que fica invisivel no editor e ja se perdeu
    // uma vez nesta mesma sessao ao ser retranscrito, virando um
    // espaco comum sem nenhum aviso no diff.
    const valor = { nome: "Whey\u2028Concentrado" }
    const saida = jsonParaScript(valor)
    expect(saida.includes("\u2028")).toBe(false)
  })

  it("nao deixa o separador de paragrafo U+2029 literal na saida", () => {
    const valor = { nome: "Whey\u2029Concentrado" }
    const saida = jsonParaScript(valor)
    expect(saida.includes("\u2029")).toBe(false)
  })

  it("é transparente: avaliar a saída como JavaScript reproduz o valor original", () => {
    const valor = {
      nome: "Whey </script><script>alert(1)</script>",
      linha: "a b",
      paragrafo: "c d",
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

// Roda o script produzido de verdade dentro de um sandbox — `location` e
// `setTimeout` são injetados como parâmetros de uma Function, então as
// chamadas soltas no script (não qualificadas) resolvem para o que o teste
// controla, sem tocar o ambiente real do Node.
//
// `gtag` é passado como argumento SEPARADO e OPCIONAL: quando omitido, ele
// não entra na lista de parâmetros da Function, então `gtag` fica
// genuinamente INDECLARADO dentro do script — igual ao caso real de "GA não
// configurado" (o layout nunca chega a declarar a função). Isso é
// deliberado: `typeof gtag` não lança nem quando indeclarado, mas `if(gtag)`
// (sem o `typeof`) lançaria ReferenceError — passar `undefined` como
// PARÂMETRO nomeado mascararia essa diferença, porque um parâmetro
// declarado sempre existe no escopo (com valor `undefined`), o que não é o
// mesmo que a variável nunca ter sido declarada.
function executar(
  script: string,
  location: { replace: (url: string) => void },
  gtag?: unknown,
) {
  if (gtag === undefined) {
    const fn = new Function("location", "setTimeout", script)
    fn(location, setTimeout)
  } else {
    const fn = new Function("gtag", "location", "setTimeout", script)
    fn(gtag, location, setTimeout)
  }
}

describe("scriptDeRedirecionamento", () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })
  afterEach(() => {
    vi.useRealTimers()
  })

  it("sem GA configurado (gtag indeclarado), navega na hora, sem esperar o piso", () => {
    const replace = vi.fn()
    const script = scriptDeRedirecionamento(
      { nome: "select_item", item_id: "a", item_name: "A", item_brand: "Growth" },
      "https://loja.exemplo/a",
    )
    // Sem terceiro argumento: gtag fica indeclarado no sandbox, replicando
    // o caso real de o layout nunca ter definido a função.
    executar(script, { replace })
    expect(replace).toHaveBeenCalledWith("https://loja.exemplo/a")
    expect(replace).toHaveBeenCalledTimes(1)
  })

  it("com gtag configurado mas sem confirmação, navega só quando o piso vence", () => {
    const replace = vi.fn()
    const gtagFalso = vi.fn()
    const script = scriptDeRedirecionamento(
      { nome: "select_item", item_id: "a", item_name: "A", item_brand: "Growth" },
      "https://loja.exemplo/a",
    )
    executar(script, { replace }, gtagFalso)
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
    executar(script, { replace }, gtagFalso)
    // A captura precisa ter acontecido de verdade — senão o `?.()` abaixo
    // vira um no-op silencioso e o teste passaria mesmo se o
    // event_callback nunca fosse repassado ao gtag.
    expect(callbackCapturado).toBeTypeOf("function")
    callbackCapturado?.()
    expect(replace).toHaveBeenCalledWith("https://loja.exemplo/a")
    expect(replace).toHaveBeenCalledTimes(1)
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
    executar(script, { replace }, gtagFalso)
    expect(callbackCapturado).toBeTypeOf("function")
    callbackCapturado?.()
    vi.advanceTimersByTime(400)
    expect(replace).toHaveBeenCalledTimes(1)
  })

  it("envia o produto certo ao GA — item_id, item_name e item_brand chegam intactos", () => {
    const replace = vi.fn()
    const gtagFalso = vi.fn()
    const script = scriptDeRedirecionamento(
      {
        nome: "select_item",
        item_id: "whey-concentrado-growth",
        item_name: "Whey Protein Concentrado",
        item_brand: "Growth",
      },
      "https://loja.exemplo/whey",
    )
    executar(script, { replace }, gtagFalso)
    expect(gtagFalso).toHaveBeenCalledWith(
      "event",
      "select_item",
      expect.objectContaining({
        item_id: "whey-concentrado-growth",
        item_name: "Whey Protein Concentrado",
        item_brand: "Growth",
      }),
    )
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

/** Os três eventos que decidem o projeto (spec §8):
 *  view_item   → que produto desperta interesse
 *  select_item → que produto gera clique real na loja
 *  share       → se o público está redistribuindo
 *
 *  Union fechado de propósito: evento novo exige entrar aqui, então
 *  nenhum disparo com nome errado passa pelo compilador. */
export type AnalyticsEvent =
  | {
      nome: "view_item"
      item_id: string
      item_name: string
      item_brand: string
      item_category: string
    }
  | {
      nome: "select_item"
      item_id: string
      item_name: string
      item_brand: string
    }
  | {
      nome: "share"
      item_id: string
      method: string
    }

type Gtag = (comando: "event", nome: string, params: Record<string, unknown>) => void

declare global {
  interface Window {
    gtag?: Gtag
  }
}

/** JSON seguro para dentro de <script>: uma sequência "</script>" vinda da
 *  planilha fecharia a tag e o resto viraria HTML executável. Escapar "<"
 *  e os separadores de linha U+2028/U+2029 elimina a classe inteira.
 *
 *  As três strings de substituição abaixo usam DUAS barras invertidas de
 *  propósito. Uma barra só seria resolvida pelo próprio compilador TypeScript
 *  e o `.replace` viraria um no-op (trocar o caractere pelo próprio
 *  caractere). Com duas barras, o que sobra em tempo de execução é o texto
 *  de escape (ex.: os seis caracteres \, u, 0, 0, 3, c) — sem nenhum "<"
 *  literal na saída, então o tokenizer de HTML não fecha a </script>. O
 *  parser de JavaScript, ao reidratar o valor, devolve o caractere
 *  original, então o JSON continua correto em tempo de execução. */
export function jsonParaScript(valor: unknown): string {
  return JSON.stringify(valor)
    .replace(/</g, "\\u003c")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029")
}

/** Dispara do cliente. Silencioso quando o GA4 não está configurado —
 *  site sem NEXT_PUBLIC_GA_ID funciona igual, só não mede. */
export function enviarEvento(evento: AnalyticsEvent): void {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return
  const { nome, ...params } = evento
  window.gtag("event", nome, params)
}

/** Script completo do /ir/[slug]: registra o evento e SEMPRE navega —
 *  cedo, se o GA confirmar o envio via `event_callback`; sem GA
 *  configurado, na hora, sem esperar nada; com GA configurado mas sem
 *  confirmação, no piso de `timeoutMs`. Nunca deixa a pessoa presa
 *  esperando, e nunca espera à toa quando não há nada pra confirmar.
 *
 *  Por que precisa desse jeito: o layout raiz define `gtag` de forma
 *  síncrona (ver app/layout.tsx) exatamente para que ele já exista
 *  quando este script — HTML puro, roda no parse, antes de qualquer
 *  hidratação do React — for alcançado. Sem essa garantia, o disparo de
 *  `select_item` corria contra a navegação e podia nunca sair —
 *  exatamente o único número que decide o dia 30 (spec §8). O
 *  `event_callback` só espera a CONFIRMAÇÃO de envio; o piso é a rede de
 *  segurança para quando o gtag.js real (carregado async) não responde
 *  a tempo — e só entra em jogo quando o GA está de fato configurado. */
export function scriptDeRedirecionamento(
  evento: AnalyticsEvent,
  link: string,
  timeoutMs = 400,
): string {
  const { nome, ...params } = evento
  return [
    "var feito=false;",
    `function ir(){if(feito)return;feito=true;location.replace(${jsonParaScript(link)});}`,
    "if(typeof gtag==='function'){",
    // Object.assign, não concatenação de texto no JSON: continua correto
    // mesmo se `params` algum dia vier vazio, sem depender da posição do
    // "}" final na string escapada.
    `gtag('event',${jsonParaScript(nome)},Object.assign({},${jsonParaScript(params)},{event_callback:ir}));`,
    `setTimeout(ir,${timeoutMs});`,
    // Sem GA configurado, `gtag` nem existe — não há o que confirmar,
    // então o piso de segurança não se aplica: sai na mesma hora.
    "}else{ir();}",
  ].join("")
}

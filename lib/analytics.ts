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
 *  e os separadores de linha U+2028/U+2029 elimina a classe inteira. */
export function jsonParaScript(valor: unknown): string {
  return JSON.stringify(valor)
    .replace(/</g, "\u003c")
    .replace(/\u2028/g, "\u2028")
    .replace(/\u2029/g, "\u2029")
}

/** Dispara do cliente. Silencioso quando o GA4 não está configurado —
 *  site sem NEXT_PUBLIC_GA_ID funciona igual, só não mede. */
export function enviarEvento(evento: AnalyticsEvent): void {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return
  const { nome, ...params } = evento
  window.gtag("event", nome, params)
}

/** Versão em string, para o <script> inline do /ir/[slug] — lá o evento
 *  precisa sair ANTES da navegação, então não dá para esperar o React
 *  hidratar. O `typeof gtag` protege o caso sem GA4 configurado. */
export function scriptDeEvento(evento: AnalyticsEvent): string {
  const { nome, ...params } = evento
  return `if(typeof gtag==='function'){gtag('event',${jsonParaScript(nome)},${jsonParaScript(params)});}`
}

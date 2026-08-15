"use client"

import { useState } from "react"
import { Share2, Check } from "lucide-react"
import { enviarEvento } from "@/lib/analytics"
import { home } from "@/content/home"
import type { Produto } from "@/content/produtos"

/** Compartilhar usa o WhatsApp de QUEM ESTÁ NAVEGANDO, não o do Diogo —
 *  por isso funciona mesmo com site.whatsapp.numero ainda null.
 *
 *  Onde a Web Share API existe (praticamente todo mobile), ela abre o
 *  seletor nativo do sistema; onde não existe (desktop), copia o link
 *  para a área de transferência e confirma na própria etiqueta do botão. */
export function BotaoCompartilhar({ produto }: { produto: Produto }) {
  const [copiado, setCopiado] = useState(false)

  async function compartilhar() {
    const url = window.location.href
    const texto = `${produto.nome} — ${produto.descricao_curta}`

    try {
      if (navigator.share) {
        await navigator.share({ title: produto.nome, text: texto, url })
        enviarEvento({ nome: "share", item_id: produto.slug, method: "web_share" })
        return
      }
      await navigator.clipboard.writeText(url)
      setCopiado(true)
      setTimeout(() => setCopiado(false), 2000)
      enviarEvento({ nome: "share", item_id: produto.slug, method: "clipboard" })
    } catch {
      // Usuário cancelou o seletor nativo, ou a permissão de área de
      // transferência foi negada. Nada a fazer — não é erro do site.
    }
  }

  return (
    <button
      type="button"
      onClick={compartilhar}
      className="inline-flex w-full items-center justify-center gap-2 border border-line px-6 py-3.5 font-mono text-xs uppercase tracking-[0.14em] text-text-muted transition-colors hover:border-aco hover:text-text sm:w-auto"
    >
      {copiado ? (
        <Check className="h-4 w-4" aria-hidden="true" />
      ) : (
        <Share2 className="h-4 w-4" aria-hidden="true" />
      )}
      {copiado ? home.produto.ctaCopiado : home.produto.ctaCompartilhar}
    </button>
  )
}

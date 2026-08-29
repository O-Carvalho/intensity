"use client"

import Image from "next/image"
import { useState } from "react"

const PLACEHOLDER = "/produtos/placeholder.png"

/** Imagem de produto 1:1. Se a URL da loja parceira quebrar (a loja
 *  reorganiza o CDN de tempos em tempos — risco registrado na spec §11),
 *  cai para o placeholder em vez de deixar um buraco no card. */
export function ProdutoImagem({
  src,
  alt,
  priority = false,
  elevado = false,
}: {
  src: string
  alt: string
  priority?: boolean
  elevado?: boolean
}) {
  const [origem, setOrigem] = useState(src)
  const [srcAnterior, setSrcAnterior] = useState(src)

  // Se a mesma instância for reaproveitada para outro produto (grade
  // filtrada, carrossel), o estado não se reinicia sozinho e a imagem do
  // produto anterior — ou o placeholder herdado da falha dele — ficaria na
  // tela. O ajuste é feito durante o render, e não num efeito: assim o React
  // descarta o render em andamento e recomeça com o valor certo, sem pintar
  // o quadro errado antes de corrigir.
  if (src !== srcAnterior) {
    setSrcAnterior(src)
    setOrigem(src)
  }

  return (
    // O poço da imagem anda no sentido oposto ao do card: se o card subiu
    // de nível (elevado), o poço desce para bg-panel; se o card ficou no
    // nível base, o poço sobe para bg-panel-raised. Assim há sempre
    // separação visual entre o poço e o corpo do card, nos dois níveis.
    <div className={`relative aspect-square w-full overflow-hidden ${elevado ? "bg-panel" : "bg-panel-raised"}`}>
      <Image
        src={origem}
        alt={alt}
        fill
        sizes="(min-width: 1024px) 300px, (min-width: 640px) 45vw, 90vw"
        className="object-contain"
        priority={priority}
        onError={() => setOrigem(PLACEHOLDER)}
      />
    </div>
  )
}

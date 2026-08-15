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
}: {
  src: string
  alt: string
  priority?: boolean
}) {
  const [origem, setOrigem] = useState(src)

  return (
    <div className="relative aspect-square w-full overflow-hidden bg-panel-raised">
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

import type { ReactNode } from "react"

/** Micro-rótulo do sistema "Rótulo": mono, caixa alta, tracking largo, aço.
 *  Cor fixa em aço por decisão semântica (aço = estrutura) E por contraste:
 *  11px em --color-text-dim daria 3.47:1 e falharia AA. */
export function MicroRotulo({
  children,
  className = "",
}: {
  children: ReactNode
  className?: string
}) {
  return <span className={`micro-rotulo ${className}`}>{children}</span>
}

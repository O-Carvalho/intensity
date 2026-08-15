"use client"

import { ArrowUp } from "lucide-react"

export function BackToTop() {
  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Voltar ao início"
      className="flex h-9 w-9 items-center justify-center border border-line text-aco transition-colors hover:border-aco hover:text-text"
    >
      <ArrowUp className="h-4 w-4" />
    </button>
  )
}

"use client"

import { ArrowUp } from "lucide-react"
import { site } from "@/content/site"

export function BackToTop() {
  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label={site.acessibilidade.voltarAoTopo}
      className="flex h-9 w-9 items-center justify-center border border-line text-aco transition-colors hover:border-aco hover:text-text"
    >
      <ArrowUp className="h-4 w-4" />
    </button>
  )
}

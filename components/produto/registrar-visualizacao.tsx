"use client"

import { useEffect } from "react"
import { enviarEvento } from "@/lib/analytics"
import type { Produto } from "@/content/produtos"

/** Dispara view_item uma vez por abertura da ficha. Não renderiza nada —
 *  existe só para levar um efeito de cliente para dentro de uma página
 *  que, de resto, é toda estática. */
export function RegistrarVisualizacao({ produto }: { produto: Produto }) {
  useEffect(() => {
    enviarEvento({
      nome: "view_item",
      item_id: produto.slug,
      item_name: produto.nome,
      item_brand: produto.marca,
      item_category: produto.categoria,
    })
  }, [produto])

  return null
}

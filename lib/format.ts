/** Normaliza texto para busca: minúsculo e sem acento, para que "proteina"
 *  encontre "Proteína" e "integralmedica" encontre "Integralmédica". */
export function normalizarBusca(texto: string): string {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
}

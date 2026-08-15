/** Parser de CSV no dialeto que o Google Sheets exporta (RFC 4180).
 *
 *  Sem I/O e sem conhecimento de domínio de propósito: recebe texto,
 *  devolve linhas. Quem sabe o que é um produto é `content/produtos.ts`.
 *
 *  Campo entre aspas pode conter vírgula, quebra de linha e aspas
 *  escapadas por duplicação (""). Fora das aspas, vírgula separa campos e
 *  \n ou \r\n separa linhas.
 */
export function parseCsv(texto: string): Record<string, string>[] {
  const linhas = dividirEmLinhas(texto)
  if (linhas.length < 2) return []

  const cabecalho = linhas[0].map((campo) => campo.trim())

  return linhas.slice(1).map((campos) => {
    const linha: Record<string, string> = {}
    cabecalho.forEach((chave, i) => {
      linha[chave] = (campos[i] ?? "").trim()
    })
    return linha
  })
}

function dividirEmLinhas(texto: string): string[][] {
  const linhas: string[][] = []
  let campos: string[] = []
  let campo = ""
  let dentroDeAspas = false

  for (let i = 0; i < texto.length; i++) {
    const c = texto[i]

    if (dentroDeAspas) {
      if (c === '"') {
        // Aspas duplicadas dentro de campo citado = uma aspa literal.
        if (texto[i + 1] === '"') {
          campo += '"'
          i++
        } else {
          dentroDeAspas = false
        }
      } else {
        campo += c
      }
      continue
    }

    if (c === '"') {
      dentroDeAspas = true
    } else if (c === ",") {
      campos.push(campo)
      campo = ""
    } else if (c === "\n" || c === "\r") {
      // \r\n conta como um único fim de linha.
      if (c === "\r" && texto[i + 1] === "\n") i++
      campos.push(campo)
      linhas.push(campos)
      campos = []
      campo = ""
    } else {
      campo += c
    }
  }

  campos.push(campo)
  linhas.push(campos)

  // Uma linha só existe se algum campo dela tiver conteúdo.
  return linhas.filter((l) => l.some((c) => c.trim() !== ""))
}

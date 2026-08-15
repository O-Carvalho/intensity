import { describe, expect, it } from "vitest"
import { normalizarBusca } from "@/lib/format"

/** Qualquer marca diacrítica combinante. É contra ISTO que vale asserir:
 *  `normalizarBusca` decompõe (NFD) antes de remover, então um "í" nunca
 *  sobrevive inteiro nem quando a remoção falha — ele vira "i" seguido da
 *  marca. Procurar pelo "í" pré-composto passaria com a função quebrada.
 *  O intervalo vai escrito como escape, nunca com o caractere literal: uma
 *  marca combinante colada no código-fonte é invisível e some sem deixar
 *  rastro no diff se um formatador encostar nela. */
const MARCA_DIACRITICA = /[\u0300-\u036f]/

describe("normalizarBusca", () => {
  it("remove o acento de 'Proteína'", () => {
    const resultado = normalizarBusca("Proteína")
    expect(resultado).toBe("proteina")
    expect(resultado).not.toMatch(MARCA_DIACRITICA)
  })

  it("remove o acento de 'Integralmédica'", () => {
    const resultado = normalizarBusca("Integralmédica")
    expect(resultado).toBe("integralmedica")
    expect(resultado).not.toMatch(MARCA_DIACRITICA)
  })

  it("normaliza maiúsculas para minúsculas", () => {
    expect(normalizarBusca("CREATINA")).toBe("creatina")
  })

  it("remove espaços das pontas", () => {
    expect(normalizarBusca("  creatina  ")).toBe("creatina")
  })

  it("deixa string ASCII sem acento inalterada, além do trim", () => {
    expect(normalizarBusca("whey growth")).toBe("whey growth")
  })
})

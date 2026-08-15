import { describe, expect, it } from "vitest"
import { normalizarBusca } from "@/lib/format"

describe("normalizarBusca", () => {
  it("remove o acento de 'Proteína'", () => {
    const resultado = normalizarBusca("Proteína")
    expect(resultado).toBe("proteina")
    expect(resultado).not.toContain("í")
  })

  it("remove o acento de 'Integralmédica'", () => {
    const resultado = normalizarBusca("Integralmédica")
    expect(resultado).toBe("integralmedica")
    expect(resultado).not.toContain("é")
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

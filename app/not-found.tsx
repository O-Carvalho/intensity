import Link from "next/link"
import { Container } from "@/components/ui/container"
import { MicroRotulo } from "@/components/ui/micro-rotulo"
import { Button } from "@/components/ui/button"
import { home } from "@/content/home"
import { getCategoriasEmUso } from "@/content/produtos"

/** O 404 nunca é um beco: sugere categorias e devolve ao catálogo.
 *  Aqui chegam links quebrados de grupo, então a saída precisa ser óbvia. */
export default async function NotFound() {
  // Se a planilha estiver fora do ar, o 404 continua de pé — só sem os
  // chips. Uma página de erro que também quebra é a pior falha possível.
  let categorias: readonly string[] = []
  try {
    categorias = await getCategoriasEmUso()
  } catch {
    categorias = []
  }

  return (
    <main className="py-24">
      <Container className="flex max-w-2xl flex-col gap-6">
        <MicroRotulo>{home.naoEncontrado.eyebrow}</MicroRotulo>
        <h1 className="display-expandido text-4xl text-text sm:text-5xl">
          {home.naoEncontrado.titulo}
        </h1>
        <p className="text-text-muted">{home.naoEncontrado.texto}</p>

        <ul className="flex flex-wrap gap-2">
          {categorias.map((c) => (
            <li key={c}>
              <Link
                href="/"
                className="inline-block border border-line px-4 py-2 font-mono text-xs uppercase tracking-[0.14em] text-aco transition-colors hover:border-aco hover:text-text"
              >
                {c}
              </Link>
            </li>
          ))}
        </ul>

        <div>
          <Button href="/">{home.naoEncontrado.voltar}</Button>
        </div>
      </Container>
    </main>
  )
}

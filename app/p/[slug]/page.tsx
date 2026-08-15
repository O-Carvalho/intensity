import Link from "next/link"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { Container } from "@/components/ui/container"
import { MicroRotulo } from "@/components/ui/micro-rotulo"
import { ProdutoImagem } from "@/components/ui/produto-imagem"
import { FichaTecnica } from "@/components/produto/ficha-tecnica"
import { BotaoCompartilhar } from "@/components/produto/botao-compartilhar"
import { RegistrarVisualizacao } from "@/components/produto/registrar-visualizacao"
import { Relacionados } from "@/components/produto/relacionados"
import { buildMetadata } from "@/lib/seo"
import { home } from "@/content/home"
import { getCatalogo, getProduto, getRelacionados } from "@/content/produtos"

/** As páginas conhecidas nascem no build; slug novo é atendido sob demanda
 *  (dynamicParams), então o Diogo publica um produto sem deploy nenhum. */
export async function generateStaticParams() {
  return (await getCatalogo()).map((p) => ({ slug: p.slug }))
}

export const dynamicParams = true

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const produto = await getProduto(slug)
  if (!produto) return buildMetadata({ titulo: home.naoEncontrado.titulo })

  // O que converte no grupo do WhatsApp é o preview: imagem, título e
  // descrição próprios de cada produto (ADR-01).
  return buildMetadata({
    titulo: `${produto.nome} — ${produto.marca}`,
    descricao: produto.descricao_curta,
    caminho: `/p/${produto.slug}`,
    imagem: produto.imagem_url,
  })
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const produto = await getProduto(slug)
  if (!produto) notFound()

  const relacionados = await getRelacionados(produto)
  const encerrado = produto.ativo === "N"

  const linhasDaFicha = [
    { rotulo: "Marca", valor: produto.marca },
    ...(produto.porcao ? [{ rotulo: "Porção", valor: produto.porcao }] : []),
    { rotulo: "Categoria", valor: produto.categoria },
  ]

  return (
    <main>
      <RegistrarVisualizacao produto={produto} />

      <Container className="py-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.14em] text-aco transition-colors hover:text-text"
        >
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
          {home.produto.voltar}
        </Link>
      </Container>

      <Container className="grid grid-cols-1 gap-10 pb-16 lg:grid-cols-2 lg:gap-16">
        <div className="border border-line bg-panel">
          <ProdutoImagem src={produto.imagem_url} alt={produto.nome} priority />
        </div>

        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-3">
            <MicroRotulo className="!text-oxido">{produto.categoria}</MicroRotulo>
            <h1 className="display-expandido text-3xl text-text sm:text-5xl">
              {produto.nome}
            </h1>
            <p className="text-text-muted">{produto.descricao_curta}</p>
            {produto.beneficio && (
              <p className="border-l-2 border-oxido pl-4 text-text">
                {produto.beneficio}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-4">
            <MicroRotulo>{home.produto.tituloFicha}</MicroRotulo>
            <FichaTecnica linhas={linhasDaFicha} />
          </div>

          {encerrado ? (
            <div className="border border-line bg-panel p-5">
              <p className="display-expandido text-base text-text">
                {home.produto.encerrado.titulo}
              </p>
              <p className="mt-2 text-sm text-text-muted">
                {home.produto.encerrado.texto}
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3 sm:flex-row">
              {/* Aponta para /ir/[slug], nunca para a loja direto: trocar o
                  link de afiliado vira edição de uma célula, e nenhuma
                  página já compartilhada quebra (ADR-04). */}
              <a
                href={`/ir/${produto.slug}`}
                className="inline-flex w-full items-center justify-center gap-2 bg-oxido px-6 py-3.5 font-mono text-xs uppercase tracking-[0.14em] text-bg transition-colors hover:bg-oxido-bright sm:w-auto"
              >
                {home.produto.ctaLoja}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </a>
              <BotaoCompartilhar produto={produto} />
            </div>
          )}
        </div>
      </Container>

      <Relacionados produtos={relacionados} />
    </main>
  )
}

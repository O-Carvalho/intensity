import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { getProduto } from "@/content/produtos"
import { scriptDeRedirecionamento } from "@/lib/analytics"
import { home } from "@/content/home"

/** Página de saída: registra select_item e manda para a loja parceira.
 *
 *  Por que uma página e não um redirect 302: o evento precisa ser
 *  registrado ANTES da saída, e um redirect no servidor não deixa nada
 *  rodar no browser. O custo é de até 400ms (o piso de segurança — a
 *  navegação sai mais cedo assim que o GA confirmar o envio); o retorno
 *  é saber, por produto, o que gera clique real — o único número que
 *  decide o dia 30. */
export const metadata: Metadata = {
  title: home.ir.titulo,
  robots: { index: false, follow: false },
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const produto = await getProduto(slug)

  // Produto encerrado não redireciona para a loja: o link já não vale.
  // Quem chegar aqui cai no 404, que devolve ao catálogo por categoria.
  if (!produto || produto.ativo === "N") notFound()

  // 400ms de piso, não 120: o layout raiz garante que `gtag` já existe
  // quando este script roda, mas o script real do GA4 (carregado async)
  // pode ainda não ter chegado — o event_callback navega assim que o
  // envio for confirmado, o piso só cobre o caso de nunca confirmar.
  const script = scriptDeRedirecionamento(
    {
      nome: "select_item",
      item_id: produto.slug,
      item_name: produto.nome,
      item_brand: produto.marca,
    },
    produto.link_afiliado,
  )

  return (
    <>
      {/* Sem JavaScript, o meta refresh leva para o mesmo lugar na hora.
          Nesse caminho o clique não é medido — é o tradeoff correto:
          melhor não medir do que não entregar a pessoa na loja. */}
      <noscript>
        <meta httpEquiv="refresh" content={`0;url=${produto.link_afiliado}`} />
      </noscript>

      <main className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-6 text-center">
        <p className="micro-rotulo">{home.ir.eyebrow}</p>
        <p className="display-expandido text-2xl text-text">{produto.nome}</p>
        <p className="text-sm text-text-muted">
          {home.ir.fallbackPrefixo}{" "}
          <a
            href={produto.link_afiliado}
            rel="noopener noreferrer nofollow sponsored"
            className="text-oxido underline underline-offset-4"
          >
            {home.ir.fallbackLink}
          </a>
          .
        </p>
      </main>

      <script dangerouslySetInnerHTML={{ __html: script }} />
    </>
  )
}

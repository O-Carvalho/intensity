import { readFile } from "node:fs/promises"
import path from "node:path"
import { z } from "zod"
import { parseCsv } from "@/lib/csv"

/** Categorias do catálogo. A ordem aqui é a ordem dos chips no site. */
export const CATEGORIAS = [
  "Proteína",
  "Pré-treino",
  "Creatina",
  "Vitaminas",
  "Termogênico",
  "Acessórios",
] as const

export type Categoria = (typeof CATEGORIAS)[number]

const SEGUNDOS_DE_REVALIDACAO = 300

const linkHttps = z
  .string()
  .url("precisa ser um link completo, começando com https://")
  .refine((v) => v.startsWith("https://") || v.startsWith("http://"), {
    message: "só aceita link http:// ou https://",
  })

/** Imagem pode ser um link https da loja parceira ou um caminho local
 *  (`/produtos/...`) enquanto o material real não existe. */
const imagem = z.string().refine(
  (v) => v.startsWith("/") || v.startsWith("https://"),
  { message: "precisa ser um link https:// ou um caminho começando com /" },
)

/** Campo opcional na planilha chega como "" quando a célula está vazia. */
const opcional = z
  .string()
  .transform((v) => (v === "" ? undefined : v))
  .optional()

/** S/N tolerante a minúscula e espaço — o Diogo digita à mão.
 *  `errorMap` e não `message`: no Zod 3, z.enum só aceita RawCreateParams
 *  (errorMap/invalid_type_error/required_error), e o desvio de enum emite
 *  `invalid_enum_value`, que invalid_type_error não alcança. */
const simNao = z
  .string()
  .transform((v) => v.trim().toUpperCase())
  .pipe(
    z.enum(["S", "N"], {
      errorMap: () => ({ message: 'preencha com "S" ou "N"' }),
    }),
  )

/** Loja/plataforma onde o produto é comprado. Texto livre, e não enum como
 *  `categoria`: loja nova precisa entrar sozinha, sem republicar o site. O
 *  preço é que "Amazon" e "amazon" viram dois filtros distintos na tela —
 *  erro visível o bastante para o Diogo perceber e corrigir. */
const plataforma = z
  .string({ required_error: 'coluna "plataforma" ausente na planilha' })
  .transform((v) => v.trim())
  .pipe(z.string().min(2, "mínimo 2 caracteres — é a loja onde se compra"))

export const produtoSchema = z.object({
  slug: z
    .string()
    .regex(/^[a-z0-9-]+$/, "minúsculo, sem acento, sem espaço, hifenizado"),
  nome: z.string().min(3, "mínimo 3 caracteres").max(60, "máximo 60 caracteres"),
  marca: z.string().min(2, "mínimo 2 caracteres"),
  categoria: z.enum(CATEGORIAS, {
    errorMap: () => ({ message: `use uma destas: ${CATEGORIAS.join(", ")}` }),
  }),
  porcao: opcional,
  imagem_url: imagem,
  descricao_curta: z
    .string()
    .min(60, "mínimo 60 caracteres — é o texto do preview no WhatsApp")
    .max(160, "máximo 160 caracteres"),
  beneficio: opcional,
  link_afiliado: linkHttps,
  plataforma,
  destaque: simNao,
  ativo: simNao,
})

export type Produto = z.infer<typeof produtoSchema>

/** Valida as linhas da planilha e devolve o catálogo tipado.
 *  Puro: não faz I/O, para poder ser testado sem rede nem disco.
 *  Lança Error com LINHA e COLUNA da planilha — mensagem genérica obriga o
 *  Diogo a ligar para o desenvolvedor, que é o que este desenho evita. */
export function validarCatalogo(linhas: Record<string, string>[]): Produto[] {
  const produtos = linhas.map((linha, i) => {
    const numeroDaLinha = i + 2 // +1 pelo cabeçalho, +1 porque planilha conta do 1
    const r = produtoSchema.safeParse(linha)
    if (!r.success) {
      const problema = r.error.issues[0]
      const coluna = String(problema.path[0] ?? "?")
      throw new Error(
        `Planilha inválida — Linha ${numeroDaLinha}, coluna "${coluna}": ${problema.message}`,
      )
    }
    return r.data
  })

  const vistos = new Map<string, number>()
  produtos.forEach((p, i) => {
    const numeroDaLinha = i + 2
    const anterior = vistos.get(p.slug)
    if (anterior !== undefined) {
      throw new Error(
        `Planilha inválida — o slug "${p.slug}" está repetido: aparece na linha ${anterior} e de novo na linha ${numeroDaLinha}. Cada produto precisa de um slug único.`,
      )
    }
    vistos.set(p.slug, numeroDaLinha)
  })

  return produtos
}

/** Fonte do catálogo.
 *
 *  Com PLANILHA_CSV_URL setada, lê a planilha publicada do Google com
 *  revalidação de 5 minutos: o Diogo salva e o site se atualiza sozinho,
 *  sem deploy. Se a planilha cair ou vier inválida, a revalidação falha e
 *  o Next continua servindo a última versão válida — o pior caso é ficar
 *  desatualizado, nunca quebrado.
 *
 *  [PENDENTE] Sem a variável, lê o catálogo de DEMONSTRAÇÃO do disco.
 *  Esses produtos são stand-in: existem para o site ter forma antes da
 *  planilha real. Setar PLANILHA_CSV_URL desliga o fixture sozinho. */
async function lerCsv(): Promise<string> {
  const url = process.env.PLANILHA_CSV_URL

  if (!url) {
    return readFile(
      path.join(process.cwd(), "content/fixtures/produtos-demo.csv"),
      "utf8",
    )
  }

  const res = await fetch(url, { next: { revalidate: SEGUNDOS_DE_REVALIDACAO } })
  if (!res.ok) throw new Error(`Planilha indisponível (HTTP ${res.status})`)
  return res.text()
}

/** Todos os produtos, inclusive os encerrados (ativo = N). */
export async function getProdutos(): Promise<Produto[]> {
  return validarCatalogo(parseCsv(await lerCsv()))
}

/** Só o que está no ar. É o que a vitrine lista. */
export async function getCatalogo(): Promise<Produto[]> {
  return (await getProdutos()).filter((p) => p.ativo === "S")
}

/** Busca por slug em TODOS os produtos, não só nos ativos: um link já
 *  compartilhado em grupo nunca pode virar 404 (ADR-05). */
export async function getProduto(slug: string): Promise<Produto | undefined> {
  return (await getProdutos()).find((p) => p.slug === slug)
}

/** No máximo 3 destaques. Se a planilha tiver mais, os 3 primeiros valem —
 *  excesso de destaque nunca derruba o site, só deixa de aparecer. */
export async function getDestaques(): Promise<Produto[]> {
  return (await getCatalogo()).filter((p) => p.destaque === "S").slice(0, 3)
}

export async function getRelacionados(
  produto: Produto,
  limite = 3,
): Promise<Produto[]> {
  return (await getCatalogo())
    .filter((p) => p.categoria === produto.categoria && p.slug !== produto.slug)
    .slice(0, limite)
}

/** Categorias que têm ao menos um produto ativo, na ordem de CATEGORIAS. */
export async function getCategoriasEmUso(): Promise<Categoria[]> {
  const catalogo = await getCatalogo()
  return CATEGORIAS.filter((c) => catalogo.some((p) => p.categoria === c))
}

/** Plataformas distintas com ao menos um produto ativo, em ordem
 *  alfabética pt-BR. Texto livre, então a lista se monta do dado —
 *  loja nova aparece no filtro sozinha. */
export async function getPlataformasEmUso(): Promise<string[]> {
  const catalogo = await getCatalogo()
  return [...new Set(catalogo.map((p) => p.plataforma))].sort((a, b) =>
    a.localeCompare(b, "pt-BR"),
  )
}

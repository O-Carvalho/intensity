export const home = {
  hero: {
    eyebrow: "seleção do diogo",
    // Quebras de linha propositais — o headline é composto em três
    // blocos de display expandido, como as três linhas de um rótulo.
    linhas: ["O que eu uso", "e indico de", "verdade."] as const,
    // A palavra da última linha que recebe o acento óxido.
    destaque: "verdade.",
  },
  catalogo: {
    tituloDestaques: "Em destaque",
    tituloTodos: "Catálogo completo",
    labelTodos: "Todos",
    labelFiltroCategoria: "Filtrar por categoria",
    placeholderBusca: "Buscar por nome ou marca",
    semResultado: "Nada com esse nome. Tenta pela categoria ali em cima.",
    // Rótulo do resumo: "15 produtos · 6 categorias"
    resumo: (produtos: number, categorias: number) =>
      `${produtos} ${produtos === 1 ? "produto" : "produtos"} · ${categorias} ${
        categorias === 1 ? "categoria" : "categorias"
      }`,
  },
  produto: {
    voltar: "Voltar ao catálogo",
    tituloFicha: "Ficha técnica",
    ctaLoja: "Ver na loja",
    ctaCompartilhar: "Compartilhar no WhatsApp",
    ctaCopiado: "Link copiado",
    tituloRelacionados: "Também da mesma categoria",
    encerrado: {
      titulo: "Produto encerrado",
      texto: "Esse produto saiu de linha. Ver o que tem na mesma categoria.",
    },
  },
  sobre: {
    titulo: "Quem indica",
    // [PENDENTE] texto ainda não escrito pelo Diogo. Enquanto for null,
    // a página /sobre exibe só a nota de transparência do rodapé —
    // nunca uma biografia inventada.
    texto: null as string | null,
  },
  naoEncontrado: {
    titulo: "Essa página não existe",
    texto: "Talvez o link tenha vindo quebrado. Escolhe por aqui:",
    voltar: "Ir para o catálogo",
  },
  ir: {
    titulo: "Redirecionando…",
    eyebrow: "indo para a loja",
    fallbackPrefixo: "Se nada acontecer,",
    fallbackLink: "clique aqui",
  },
  rodape: {
    transparencia: "Recebo comissão pelas indicações. O preço para você é o mesmo.",
  },
} as const

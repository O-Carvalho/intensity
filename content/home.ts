export const home = {
  hero: {
    eyebrow: "destaques",
    // Quebras de linha propositais — o headline é composto em três
    // blocos de display expandido, como as três linhas de um rótulo.
    linhas: ["Mais opções.", "Melhores preços.", "Tudo para o seu treino."] as const,
    // A palavra da última linha que recebe o acento óxido.
    destaque: "Tudo para o seu treino.",
  },
  catalogo: {
    tituloDestaques: "Em destaque",
    tituloTodos: "Catálogo completo",
    placeholderBusca: "Buscar por nome ou marca",
    semResultado: "Nada com essa combinação. Tenta tirar um filtro.",
    // Rótulo do resumo: "15 produtos · 6 categorias"
    resumo: (produtos: number, categorias: number) =>
      `${produtos} ${produtos === 1 ? "produto" : "produtos"} · ${categorias} ${
        categorias === 1 ? "categoria" : "categorias"
      }`,
    botaoFiltrar: "Filtrar",
    tituloPainel: "Filtros",
    fecharPainel: "Fechar filtros",
    limparTudo: "Limpar tudo",
    secaoCategoria: "Categoria",
    secaoPlataforma: "Onde comprar",
    filtrosAtivos: "Filtros ativos",
    removerFiltro: (valor: string) => `Remover filtro ${valor}`,
    contagemResultado: (n: number) =>
      `${n} ${n === 1 ? "produto" : "produtos"}`,
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
    eyebrow: "sobre",
    titulo: "Quem indica",
    texto:
      "Preserve sua saúde.\nSeja cada dia mais forte.\nTrabalhe para ser melhor do que ontem e prepare-se para ser ainda melhor amanhã." as string | null,
    ctaCatalogo: "Ver o catálogo",
    ctaContato: "Falar comigo",
  },
  naoEncontrado: {
    eyebrow: "erro 404",
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

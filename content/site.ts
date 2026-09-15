export const site = {
  nome: "Intensity",
  tagline: "Destaques",
  tituloSeo: "Intensity — mais opções e melhores preços para o seu treino",
  descricaoSeo:
    "Suplementos para o seu treino: mais opções, melhores preços e tudo o que você precisa para treinar forte.",
  // [PENDENTE] domínio ainda não registrado. Trocar aqui quando
  // intensity.com.br (ou o escolhido) estiver apontado para a Vercel —
  // metadataBase, canonical, sitemap e robots leem tudo desta linha.
  url: "https://intensity.vercel.app",
  whatsapp: {
    // [PENDENTE] número do Diogo ainda não fornecido. Enquanto for null,
    // o site não exibe nenhum CTA de contato direto — não inventamos
    // canal que não existe. Compartilhar produto continua funcionando,
    // porque usa o WhatsApp de quem está navegando, não o dele.
    numero: null as string | null,
    mensagemPadrao: "Opa! Vi a Intensity e queria te perguntar uma coisa.",
  },
  nav: [
    { label: "Catálogo", href: "/" },
    { label: "Sobre", href: "/sobre" },
  ],
  acessibilidade: {
    voltarAoTopo: "Voltar ao início",
    abrirMenu: "Abrir menu",
    fecharMenu: "Fechar menu",
  },
} as const

/** Link de conversa com o Diogo. Retorna null enquanto o número não for
 *  confirmado — o consumidor simplesmente não renderiza o CTA. */
export function linkWhatsapp(
  mensagem: string = site.whatsapp.mensagemPadrao,
): string | null {
  if (!site.whatsapp.numero) return null
  return `https://wa.me/${site.whatsapp.numero}?text=${encodeURIComponent(mensagem)}`
}

export const site = {
  nome: "Dose Certa",
  tagline: "seleção do Diogo",
  tituloSeo: "Dose Certa — os suplementos que eu uso e indico",
  descricaoSeo:
    "Seleção pessoal de suplementos que o Diogo usa e indica de verdade. Sem promessa milagrosa, sem catálogo infinito.",
  // [PENDENTE] domínio ainda não registrado. Trocar aqui quando
  // dosecerta.com.br (ou o escolhido) estiver apontado para a Vercel —
  // metadataBase, canonical, sitemap e robots leem tudo desta linha.
  url: "https://dose-certa.vercel.app",
  whatsapp: {
    // [PENDENTE] número do Diogo ainda não fornecido. Enquanto for null,
    // o site não exibe nenhum CTA de contato direto — não inventamos
    // canal que não existe. Compartilhar produto continua funcionando,
    // porque usa o WhatsApp de quem está navegando, não o dele.
    numero: null as string | null,
    mensagemPadrao: "Opa! Vi a Dose Certa e queria te perguntar uma coisa.",
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

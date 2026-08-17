import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    // As imagens de produto vêm das lojas parceiras, cujos domínios só são
    // conhecidos quando as URLs reais entrarem na planilha.
    // AO ADICIONAR UM PRODUTO COM IMAGEM EXTERNA DE UM DOMÍNIO NOVO: incluir
    // o hostname aqui, senão o next/image devolve 400 e o card fica sem
    // imagem — o placeholder local (public/produtos/placeholder.png) entra
    // no lugar automaticamente (ProdutoImagem já trata esse erro).
    remotePatterns: [
      // Growth Supplements (whey, creatina, multivitamínico, acessórios).
      { protocol: "https", hostname: "www.gsuplementos.com.br" },
      // Max Titanium — imagens de produto servidas via VTEX.
      { protocol: "https", hostname: "lojamaxtitanium.vtexassets.com" },
      // Probiótica — imagens de produto servidas via VTEX (mesma
      // plataforma da Max Titanium, CDN de conta diferente).
      { protocol: "https", hostname: "supleylab.vtexassets.com" },
    ],
  },
}

export default nextConfig

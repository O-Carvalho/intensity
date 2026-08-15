import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    // As imagens de produto vêm das lojas parceiras, cujos domínios só são
    // conhecidos quando as URLs reais entrarem na planilha. Enquanto o
    // catálogo usa o placeholder local, esta lista fica vazia.
    // AO ADICIONAR UM PRODUTO COM IMAGEM EXTERNA: incluir o hostname aqui,
    // senão o next/image devolve 400 e o card fica sem imagem.
    remotePatterns: [],
  },
}

export default nextConfig

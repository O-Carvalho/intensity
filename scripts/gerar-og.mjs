import sharp from "sharp"

// O texto abaixo repete a headline de content/home.ts (home.hero.linhas) em
// caixa alta, porque uma imagem PNG não lê content/ em tempo de execução.
// Sempre que a headline mudar, rode este script de novo — senão o preview
// do link no WhatsApp mostra uma frase antiga.
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <rect width="1200" height="630" fill="#0B0A09"/>
  <rect x="80" y="120" width="120" height="4" fill="#E24B24"/>
  <text x="80" y="230" fill="#F2EBE1" font-family="Arial, sans-serif" font-size="86" font-weight="800" letter-spacing="-2">MAIS OPÇÕES.</text>
  <text x="80" y="330" fill="#F2EBE1" font-family="Arial, sans-serif" font-size="86" font-weight="800" letter-spacing="-2">MELHORES PREÇOS.</text>
  <text x="80" y="430" fill="#E24B24" font-family="Arial, sans-serif" font-size="86" font-weight="800" letter-spacing="-2">TUDO PARA O SEU TREINO.</text>
  <line x1="80" y1="500" x2="1120" y2="500" stroke="#2E2724" stroke-width="1"/>
  <text x="80" y="550" fill="#A9A29B" font-family="monospace" font-size="26" letter-spacing="8">INTENSITY</text>
</svg>`

await sharp(Buffer.from(svg)).png().toFile("public/og-default.png")
console.log("public/og-default.png gerado")

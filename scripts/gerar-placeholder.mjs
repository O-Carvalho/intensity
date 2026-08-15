import sharp from "sharp"

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600">
  <rect width="600" height="600" fill="#14110F"/>
  <rect x="0.5" y="0.5" width="599" height="599" fill="none" stroke="#2E2724"/>
  <line x1="120" y1="300" x2="480" y2="300" stroke="#2E2724" stroke-width="1"/>
  <text x="300" y="286" fill="#A9A29B" font-family="monospace" font-size="20" letter-spacing="6" text-anchor="middle">SEM IMAGEM</text>
  <text x="300" y="336" fill="#6E655D" font-family="monospace" font-size="16" letter-spacing="4" text-anchor="middle">DOSE CERTA</text>
</svg>`

await sharp(Buffer.from(svg)).png().toFile("public/produtos/placeholder.png")
console.log("public/produtos/placeholder.png gerado")

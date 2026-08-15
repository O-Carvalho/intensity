# Dose Certa

Vitrine de suplementos que o Diogo usa e indica. Cada produto tem página
própria com preview para compartilhar no WhatsApp, e o catálogo é
alimentado por uma planilha do Google.

## Rodar localmente

    npm install
    npm run dev

## De onde vem o catálogo

Os produtos vivem numa planilha do Google publicada como CSV. A URL fica em
`PLANILHA_CSV_URL` (veja `.env.example`). Sem essa variável, o site lê o
catálogo de demonstração em `content/fixtures/produtos-demo.csv`.

O contrato do dado — colunas, regras e mensagens de erro — está em
`content/produtos.ts`.

## Verificação

    npm run test        # camada de dados
    npx tsc --noEmit
    npm run lint

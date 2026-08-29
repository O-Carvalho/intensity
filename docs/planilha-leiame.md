# Como cadastrar um produto

Preencha uma linha por produto na aba `produtos`. Salvou, o site atualiza
sozinho em até 5 minutos. Não precisa avisar ninguém.

| Coluna | Obrigatório | Regra |
|---|---|---|
| slug | sim | minúsculo, sem acento, sem espaço, com hífen. Ex.: `whey-concentrado-growth`. **Nunca mude o slug de um produto já divulgado** — todos os links que você mandou nos grupos param de funcionar. |
| nome | sim | até 60 caracteres. É o que aparece no card do WhatsApp. |
| marca | sim | Growth, Integralmédica, Max Titanium… |
| categoria | sim | exatamente uma destas: Proteína · Pré-treino · Creatina · Vitaminas · Termogênico · Acessórios |
| porcao | não | "900 g", "300 cáps" |
| imagem_url | sim | link da imagem começando com `https://`, quadrada (1:1) |
| descricao_curta | sim | entre 60 e 160 caracteres. É o texto do preview no WhatsApp. |
| beneficio | não | uma frase objetiva, sem prometer resultado |
| link_afiliado | sim | o link completo, com seus parâmetros de rastreio |
| plataforma | sim | mínimo de 2 caracteres. Onde a pessoa vai comprar: Growth, Amazon, Mercado Livre, Max Titanium… Escreva sempre igual — "Amazon" e "amazon" viram dois filtros diferentes no site. |
| destaque | sim | S ou N. No máximo 3 produtos com S. |
| ativo | sim | S ou N. N tira do catálogo mas mantém a página no ar, então o link que você já mandou não quebra. |

## Se algo der errado

Se você preencher uma linha errada, **o site não quebra** — ele continua
mostrando a última versão certa. Corrija a linha e salve de novo.

## Tirar um produto do ar

Não apague a linha. Troque `ativo` para `N`. Assim quem clicar num link
antigo vê "produto encerrado" e os outros da mesma categoria, em vez de
uma página de erro.

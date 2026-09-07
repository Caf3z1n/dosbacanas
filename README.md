# Dos Bacanas · Cardápio digital

Projeto Next.js 16 + React 19 + TypeScript, com prioridade para celular. Catálogo local com os **192 produtos e 21 categorias** do [cardápio original](https://dosbacanas.com.br/cardapiodigital), consultado em 07/09/2026.

## Publicação

Site: [dosbacanas.vercel.app](https://dosbacanas.vercel.app).

Versões: [Essência](https://dosbacanas.vercel.app/cardapio1), [Manifesto](https://dosbacanas.vercel.app/cardapio2), [After Dark](https://dosbacanas.vercel.app/cardapio3), [À Mesa](https://dosbacanas.vercel.app/cardapio4) e [Bacanas Club](https://dosbacanas.vercel.app/cardapio5).

Repositório privado: [Caf3z1n/dosbacanas](https://github.com/Caf3z1n/dosbacanas).

O deploy de produção foi feito pela Vercel CLI. Para atualizar, vincule o projeto à sua conta com `vercel link` e execute `vercel deploy --prod`. Credenciais e arquivos `.env` não fazem parte do repositório.

## Executar

Recomendado: Node.js 22.13+ e npm.

```sh
npm install
npm run dev
```

Abra http://localhost:3000 ou http://localhost:3000/cardapiodigital.

```sh
npm run build
npm start
```

## Funcionalidades

- Todas as categorias, nomes, descrições, preços e fotos do catálogo original.
- Filtro por categoria, mais pedidos, Happy Hour e promoções (quando configuradas).
- Busca por nome, descrição e categoria, tolerante a acentos.
- Categorias e busca preservadas na URL; suporte a voltar/avançar do navegador.
- Detalhes com foto ampliada, preços promocionais, navegação por teclado e fechamento por Escape/toque fora.
- Menu de categorias e atalhos fixos no celular; fotos otimizadas e carregamento sob demanda.
- Atualização pela rota mock local `/api/menu`, com estados de sucesso e erro.
- Agenda de Happy Hour e avisos configuráveis, incluindo datas especiais e “não mostrar novamente”.
- Links originais para WhatsApp, avaliação Google e site institucional.

## Dados mock

`src/data/menu.json` contém o snapshot fiel ao catálogo público. As fotos são locais em `public/images/products`. Os arquivos foram otimizados para WebP: de aproximadamente 385 MB para 26 MB, preservando o conteúdo das imagens.

`src/data/mock-config.ts` contém a agenda de demonstração e os avisos. A agenda semanal usa o texto presente no cardápio original (segunda a sexta, 17h–20h), com cálculo no fuso de São Paulo. Não consulta a agenda real do estabelecimento. Os avisos começam vazios, como na consulta feita ao original. Para testar um aviso, adicione um item com `id`, `updatedAt`, `title`, `message`, `type` e `expiresAt` futuro. O usuário pode fechar o aviso temporariamente ou dispensar aquela versão no localStorage.

Não há banco, autenticação, pedidos, checkout nem pagamento. O cardápio original também é de consulta. WhatsApp e Google são links externos reais; nenhum pedido ou mensagem é enviado automaticamente. O projeto está com indexação desativada por ser uma demonstração.

## Verificar

```sh
npm test
npm run typecheck
npm run lint
npm run build
```

Os testes verificam integridade do catálogo e imagens, combinação de busca e categorias, preços promocionais e limites de horário do Happy Hour.

## Atualização manual do snapshot

```sh
node scripts/import-menu.mjs
node scripts/optimize-images.mjs
```

O importador lê somente dados públicos e nunca executa o JavaScript do site de origem. Também aceita o caminho de um HTML previamente salvo como argumento. Revise as alterações de catálogo antes de usar uma nova importação. A documentação de direção visual está em `DESIGN.md`.

## Cinco versões

Todas compartilham o mesmo catálogo e o amarelo exato `#fdc500`.

| Rota         | Visual       | Composição e movimento                                                                      |
| ------------ | ------------ | ------------------------------------------------------------------------------------------- |
| `/cardapio1` | Essência     | Versão principal, fotos e serifas sobre preto; entradas em profundidade                     |
| `/cardapio2` | Manifesto    | Pôster amarelo, colagem inclinada, faixa em movimento e fotos circulares                    |
| `/cardapio3` | After Dark   | Carrossel de drinks, fotografia cinematográfica, galeria vertical e revelação em letterbox  |
| `/cardapio4` | À Mesa       | Papel claro, fotos em arco, índice lateral e animação de abertura da imagem                 |
| `/cardapio5` | Bacanas Club | Mosaico interativo, blocos arredondados, profundidade e catálogo em duas colunas no celular |

Os aliases `/cardario1` até `/cardario5` redirecionam para as rotas correspondentes, preservando a busca. `/` e `/cardapiodigital` continuam na versão principal.

O botão de paleta no cabeçalho troca de versão. O botão de pausa desativa os movimentos, e a preferência de movimento reduzido do dispositivo é respeitada automaticamente. O painel de categorias usa fotos reais, ícones, agrupamento e busca em todas as versões.

As transições de produto têm máscaras de revelação, aproximação e foco da foto, entrada sequencial de nome/descrição/preço e deslocamento sutil da imagem conforme a rolagem. Só os cards próximos à tela recebem atualizações de movimento. O foco do teclado cancela a animação do card para disponibilizar a interação imediatamente.

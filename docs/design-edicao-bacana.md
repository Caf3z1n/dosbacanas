# Variação 5 — Edição Bacana

## Referências consultadas

- [MOLD — Designing the Future of Food](https://thisismold.com/): organização de conteúdo gastronômico em editorias, índice numerado, leitura por capítulos e relação entre alimento, cultura e publicação. Referência para a estrutura editorial, sem reproduzir conteúdo ou identidade da publicação.
- [OFFF × COLLINS](https://wearecollins.com/story/offf/): tipografia de peso e contraste de escala, com movimento como parte da identidade. Referência para o masthead e para mudanças expressivas entre as edições.
- [New Visual Artists × COLLINS](https://wearecollins.com/story/new-visual-artists-collins/): uso da moldura para destacar trabalhos e compor uma identidade. Referência secundária para o enquadramento fotográfico e a identificação de cada item.
- Refero Design: metodologia de pesquisa, referência travada, tipografia e movimento das referências locais `references/typography.md` e `references/motion.md`. Não havia ferramentas Refero MCP disponíveis. As fontes externas foram consultadas por texto; a avaliação visual do resultado ocorre sobre a aplicação implementada.

## Referência travada

O cardápio funciona como uma revista gastronômica que pode ser explorada, folheada e descoberta. A composição se diferencia das outras variações pela abertura com masthead gigante, capa em dupla página e catálogo em pranchas assimétricas.

| Decisão | Origem | Aplicação |
| --- | --- | --- |
| Light mode, papel quase branco, preto e amarelo exato `#fdc500` | Pedido do usuário | Fundo claro, contraste forte e amarelo em abas, anotações e ações |
| Índices, capítulos e numeração dos produtos | Organização editorial da MOLD | Agrupamento por categoria, identificador visual e sequência de leitura |
| Tipografia condensada de grande escala | COLLINS/OFFF e tipografia Refero | Masthead, chamadas da capa e títulos de capítulos |
| Fotografia com moldura e legenda | Referência secundária COLLINS/NVA | Imagens existentes dos produtos; nenhuma fotografia fictícia |
| Alternância de capa e descoberta acionadas pelo visitante | Pedido de interação e movimento Refero | Mudanças de estado com continuidade; sem rotação automática do conteúdo |
| Grade assimétrica, linhas finas e cantos retos | Direção editorial escolhida | Destaque de abertura amplo seguido de itens menores, evitando o antigo conjunto de cards arredondados |

Preservar: canvas claro; amarelo da marca; protagonismo fotográfico; títulos de peso; réguas e numeração editorial; composição diferente de mesa circular, pôster amarelo e palco escuro.

Não adotar: fundos creme com serifas decorativas, mosaico de painéis arredondados, texto sobre fotografias sem contraste ou informações comerciais inventadas.

## Interações

- **Capa:** as abas Cozinha, Bar e Doce trocam a fotografia, o produto real e a composição. Também há botões anterior/próxima e canto de página. A mudança usa perspectiva, revelação fotográfica e entrada das linhas do título.
- **Detalhe da capa:** tocar na fotografia abre o mesmo modal de produto usado pelo catálogo. Os atalhos da matéria navegam para a categoria correspondente.
- **Descoberta:** Comer, Brindar e Adoçar definem o grupo de produtos. “Me surpreenda” sorteia um item real somente após ação do usuário e revela a carta. O próximo sorteio evita repetir o item atual quando existem alternativas. Abrir a carta mostra o modal do produto.
- **Mais pedidos:** o atalho da descoberta mantém o filtro existente do cardápio.
- **Catálogo:** todos os produtos recebidos são agrupados por categoria e mantêm nomes, descrições e preços, incluindo ofertas. Classes e identificadores compatíveis com a animação cinematográfica compartilhada permanecem presentes.
- **Acessibilidade:** estado dos seletores por `aria-pressed`, anúncio da sugestão por região viva, ações acessíveis por teclado e respeito à pausa e à preferência de movimento reduzido.

## Limites e cuidados

- A descoberta é uma seleção aleatória por grupo; não afirma recomendação dietética, disponibilidade ou preferência individual.
- Nenhum produto, preço, avaliação, promoção ou fluxo de compra foi inventado. O catálogo continua usando os dados mock existentes.
- A imagem e o nome da capa são obtidos do catálogo recebido. Se o produto principal faltar, a capa utiliza o primeiro item disponível; catálogo vazio não gera uma capa fictícia.
- Navegação, busca, filtros, atualização, links oficiais e bloqueio de rolagem dos modais continuam sob os componentes compartilhados.
- As linhas do título usam elementos de bloco também no celular. A animação remove o recorte ao terminar, evitando o problema de pintura de `clip-path` em texto inline quebrado em várias linhas.
- Os layouts foram preparados para 320, 390, 768 e 1440 px. A validação visual e os testes gerais são feitos pela tarefa principal sobre a integração final.

Arquivos: `src/components/themes/edicao-bacana.tsx` e `src/components/themes/edicao-bacana.css`.

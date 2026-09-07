# Direção do cardápio

Referência principal: cardápio público Dos Bacanas, consultado em 07/09/2026. A marca, as fotos, os nomes, as descrições, os preços, as categorias e as marcações comerciais vêm dessa fonte. Refero MCP indisponível nesta sessão; utilizados os guias locais de tipografia, craft e validação visual da skill Refero. Referência secundária: organização de comida e bebida do Dishoom (https://www.dishoom.com/food-drink/), restrita à separação clara entre famílias do menu.

## Alvo de implementação

Bar noturno, gastronômico e acolhedor. Preto quente #070504, amarelo original #fdc500, texto #faf5e6. Fotografia original em grande escala na abertura; o catálogo começa logo abaixo, sem uma página institucional no caminho. Tipografia serifada expressiva nos títulos, sans legível nos controles e produtos. Navegação persistente, produtos com foto, preços de fácil leitura e detalhes em modal (folha inferior no celular).

| Decisão                | Origem e papel                             | Aplicação                                                    |
| ---------------------- | ------------------------------------------ | ------------------------------------------------------------ |
| Preto e amarelo        | Tokens reais do site original              | Preto como canvas; amarelo para marca, seleção, preço e ação |
| Fotos reais            | Catálogo original                          | Assets locais; sem inventar a aparência dos pratos           |
| Serif + sans           | Marca original e guia de tipografia Refero | Display na abertura/seções; leitura compacta no catálogo     |
| Navegação por famílias | Dishoom + categorias originais             | Atalhos visuais, mantendo todas as 21 categorias originais   |
| Modal de produto       | Fluxo verificado no original               | Foto ampliada, descrição, preço, oferta, fechar/Escape       |
| Mobile                 | Guia craft Refero e pedido do usuário      | Alvos de toque amplos, rolagem horizontal, safe area e foco  |

Evitar: cores fora da marca, avaliações inventadas, excesso de gradientes, textos longos antes do menu, produtos fictícios, checkout que não existe no original. Catálogo e comunicações são mock locais. Recursos condicionais (promoções, agenda Happy Hour, avisos) têm modelos locais configuráveis.

## Referências e direção das variações

As versões 1 e 2 são os alvos aprovados. Seus componentes de abertura, cores, catálogo e movimentos foram preservados. As versões 3, 4 e 5 têm composições próprias para abertura, destaques e catálogo, mantendo o amarelo característico #fdc500. As versões 3 e 5 são light mode.

| Versão        | Direção e estrutura                                                               | Interação                                                                      |
| ------------- | --------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| Essência      | Original aprovado: preto quente, amarelo, Playfair e DM Sans                      | Máscara vertical, aproximação e texto em sequência                             |
| Manifesto     | Original aprovado: pôster amarelo, Barlow Condensed, colagem                      | Entrada lateral, inclinação e faixa com pausa                                  |
| Mesa Viva     | Branco, tipografia geométrica, mesa circular com fotos reais e catálogo em seções | Ocasiões para dividir/brindar/adoçar, miniaturas e sugestões sobre a mesa      |
| Balcão 360    | Grafite e amarelo, console de descoberta e fichas horizontais numeradas           | Seletor por slider, setas e teclado; descoberta por setores do cardápio        |
| Edição Bacana | Revista clara, masthead grande, réguas editoriais e pranchas assimétricas         | Capas Cozinha/Bar/Doce, virada de página e sorteio de produto real por vontade |

A fundamentação de cada nova direção está em [Mesa Viva](docs/design-mesa-viva.md), [Balcão 360](docs/design-balcao-360.md) e [Edição Bacana](docs/design-edicao-bacana.md). Referências externas contribuem com estrutura e interação; fotos e informações são do Dos Bacanas. As cores de outras marcas não foram importadas.

As entradas do catálogo mantêm coreografia cinematográfica com fator 1,4 no celular, aceleração suave, pausa e movimento reduzido. Controles permanecem operáveis e o foco do teclado encerra a entrada do item. O bloqueio dos modais mantém largura, posição e elementos sticky; os índices novos declaram data-scroll-lock-sticky para entrar nessa preservação.

Verificações: baseline das versões 1/2 por dimensões, cores, tipografia e layout; catálogo das novas versões comparado item a item contra a versão aprovada; revisão de telas, interações e modais em celular e desktop.

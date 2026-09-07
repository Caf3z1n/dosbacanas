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

Pedido de 07/09/2026: cinco versões completas e distintas, preservando o amarelo característico; uma versão clara permitida. O usuário solicitou ainda um painel de categorias com ícones/fotos e transições cinematográficas dos produtos. Implementação direta das cinco direções solicitadas, sem etapa intermediária de escolha.

Referências consultadas: BrewDog (https://brewdog.com), para tipografia assertiva e organização por ocasião; Death & Co (https://www.deathandcompany.com), para hero de galeria, enquadramento e preto com fotografia noturna; Dishoom (https://www.dishoom.com/food-drink/), para leitura editorial e fotos gastronômicas; Sweetgreen (https://www.sweetgreen.com), para composição modular, hierarquia sans e blocos fotográficos. Nenhuma cor dessas marcas foi importada: o destaque é sempre #fdc500. Imagens são exclusivamente do catálogo do Dos Bacanas.

| Versão       | Traços preservados na implementação                                        | Coreografia                                                                           |
| ------------ | -------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| Essência     | Composição original aprovada, preto quente, amarelo, Playfair e DM Sans    | Aproximação suave, máscara vertical e texto em sequência                              |
| Manifesto    | Amarelo dominante, Barlow Condensed, alto contraste, colagem fotográfica   | Entrada lateral alternada, inclinação, revelação horizontal, faixa contínua com pausa |
| After Dark   | Hero panorâmico com controles, serifas amplas e galeria de fotos verticais | Abertura letterbox, foco e zoom, entrada com profundidade                             |
| À Mesa       | Papel claro, texto escuro, selo amarelo, fotos em arco e índice de carta   | Revelação ascendente da foto e movimento editorial mais delicado                      |
| Bacanas Club | Mosaico de blocos arredondados, fotos reais e ações visuais por categoria  | Stagger do mosaico, tilt por mouse e entradas de produto em perspectiva               |

As animações de catálogo são deliberadamente mais expressivas (1,1–1,5 s no desktop, foto finalizando em até 1,78 s) conforme pedido explícito do usuário. No celular, durações e intervalos usam fator 1,4 e uma curva mais suave, para apreciar a entrada dos produtos com calma. Os controles continuam imediatos; sem scroll hijacking, sem telas de espera e sem esconder conteúdo quando JavaScript ou movimento não estiverem disponíveis. Pausa, movimento reduzido, foco, filtros e mudança de rota limpam as animações pertinentes.

# Balcão 360 — direção da variação 4

Um console de descoberta gastronômica: grafite, amarelo #fdc500, tipografia condensada e controles mecânicos que trocam produtos reais. A tela inicial é dividida entre composição tipográfica e seletor circular; o catálogo usa fichas horizontais, numeração vertical e fotos contínuas, evitando a repetição do hero fotográfico e dos mosaicos das versões anteriores.

Referência dominante: [Teenage Engineering EP-133](https://teenage.engineering/products/ep-133), pela hierarquia industrial, enquadramento do objeto e controles táteis. Referência secundária: [Ableton Push](https://www.ableton.com/en/push/), pela descoberta através de controles com respostas visuais claras. As referências inspiram a interação e a organização; não há player, áudio ou funções musicais simuladas.

Aplicação das referências de craft/motion do Refero: foco visível, controles com área de toque, transições que explicam a troca de seleção, contraste consistente, preferência de movimento reduzido e controle de pausa existente. O efeito do disco é uma troca manual com abertura da fotografia, rotação do indicador e atualização do visor; não muda o produto automaticamente.

Interações:

- Slider nativo, setas e teclado para explorar cinco produtos reais; fotografia abre o modal compartilhado.
- Três setores do cardápio alternam categorias reais e suas quantidades, com navegação para o catálogo filtrado.
- Atalho para os produtos marcados como mais pedidos na fonte de dados.
- Catálogo agrupa todos os produtos recebidos pelas respectivas categorias, com nomes, descrições, preços e ofertas da fonte.

Integração: exports `BalcaoHero`, `BalcaoHighlights` e `BalcaoCatalog`. Folha de estilo inteiramente restrita a `.theme-4`; componentes e animações locais usam prefixo `bc-`. Não introduz sticky, listeners de rolagem, scroll-jacking ou dependências novas. O hook compartilhado de coreografia identifica os cards via `.product-card`, `.product-photo`, `.product-copy`, `.product-bottom` e `data-product-id`.

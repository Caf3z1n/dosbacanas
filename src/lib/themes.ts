export type ThemeId = 1 | 2 | 3 | 4 | 5;
export const themes = [
  {
    id: 1,
    name: "Essência",
    description: "O original. Preto, dourado e bons encontros.",
    tone: "original",
  },
  {
    id: 2,
    name: "Manifesto",
    description:
      "Amarelo vibrante, tipografia de pôster e muita personalidade.",
    tone: "poster",
  },
  {
    id: 3,
    name: "Mesa Viva",
    description: "Uma mesa clara, tátil e cheia de descobertas.",
    tone: "table",
  },
  {
    id: 4,
    name: "Balcão 360",
    description: "Gire, explore e encontre o sabor do seu momento.",
    tone: "console",
  },
  {
    id: 5,
    name: "Edição Bacana",
    description: "Uma revista de sabores. Cada página, uma descoberta.",
    tone: "edition",
  },
] as const;

export function getTheme(slug: string) {
  return themes.find((theme) => `cardapio${theme.id}` === slug);
}

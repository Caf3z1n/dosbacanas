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
    name: "After Dark",
    description: "Coquetelaria em cena. Uma experiência cinematográfica.",
    tone: "night",
  },
  {
    id: 4,
    name: "À Mesa",
    description: "Uma carta gastronômica clara, elegante e editorial.",
    tone: "paper",
  },
  {
    id: 5,
    name: "Bacanas Club",
    description: "Mosaico interativo, formas generosas e descobertas.",
    tone: "club",
  },
] as const;

export function getTheme(slug: string) {
  return themes.find((theme) => `cardapio${theme.id}` === slug);
}

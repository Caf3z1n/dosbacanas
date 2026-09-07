import type { Category, Product } from "@/lib/menu";

export type RedesignHeroProps = {
  products: Product[];
  onSelect: (product: Product) => void;
  onCategory: (slug: string) => void;
};

export type RedesignHighlightsProps = RedesignHeroProps & {
  categories: Category[];
  onTopPicks: () => void;
};

export type RedesignCatalogProps = {
  categories: Category[];
  products: Product[];
  onSelect: (product: Product) => void;
};

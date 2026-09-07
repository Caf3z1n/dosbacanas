import snapshot from "@/data/menu.json";
import { mockConfig } from "@/data/mock-config";
import type { MenuData } from "./menu";

export const menu: MenuData = {
  categories: snapshot.categories,
  products: snapshot.products,
  ...mockConfig,
};

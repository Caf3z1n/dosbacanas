"use client";
import type { ThemeId } from "@/lib/themes";
import type {
  RedesignHighlightsProps,
  RedesignCatalogProps,
} from "./redesign-types";
import { MesaVivaHighlights, MesaVivaCatalog } from "./mesa-viva";
import { BalcaoHighlights, BalcaoCatalog } from "./balcao-360";
import { EdicaoHighlights, EdicaoCatalog } from "./edicao-bacana";

export function RedesignHighlights({
  variant,
  ...props
}: RedesignHighlightsProps & { variant: ThemeId }) {
  if (variant === 3) return <MesaVivaHighlights {...props} />;
  if (variant === 4) return <BalcaoHighlights {...props} />;
  if (variant === 5) return <EdicaoHighlights {...props} />;
  return null;
}

export function RedesignCatalog({
  variant,
  ...props
}: RedesignCatalogProps & { variant: ThemeId }) {
  if (variant === 3) return <MesaVivaCatalog {...props} />;
  if (variant === 4) return <BalcaoCatalog {...props} />;
  if (variant === 5) return <EdicaoCatalog {...props} />;
  return null;
}

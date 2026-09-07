import {
  AlarmClock,
  Beef,
  Beer,
  BottleWine,
  CakeSlice,
  Citrus,
  Compass,
  CookingPot,
  CupSoda,
  Droplets,
  Drumstick,
  GlassWater,
  Grape,
  Layers,
  Leaf,
  Martini,
  PackageOpen,
  Sparkles,
  Sun,
  Wine,
  Zap,
  type LucideIcon,
} from "lucide-react";

const icons: Record<string, LucideIcon> = {
  all: Compass,
  porcoes: Drumstick,
  tabuas: Beef,
  massas: CookingPot,
  panquecas: Layers,
  palmito: Leaf,
  "almoco-domingo": Sun,
  sobremesas: CakeSlice,
  "happy-hour": AlarmClock,
  combos: PackageOpen,
  chopp: Beer,
  cervejas: BottleWine,
  caipirinhas: Citrus,
  classicos: Martini,
  gin: Sparkles,
  doses: GlassWater,
  vinhos: Wine,
  "soft-drinks": CupSoda,
  sucos: Grape,
  "aguas-refri": Droplets,
  energeticos: Zap,
  garrafas: BottleWine,
};
export function CategoryIcon({
  slug,
  size = 18,
}: {
  slug: string;
  size?: number;
}) {
  const Icon = icons[slug] ?? Compass;
  return <Icon size={size} strokeWidth={1.6} aria-hidden="true" />;
}
export function categoryGroup(slug: string) {
  if (
    [
      "porcoes",
      "tabuas",
      "massas",
      "panquecas",
      "palmito",
      "almoco-domingo",
      "sobremesas",
    ].includes(slug)
  )
    return "cozinha";
  if (["soft-drinks", "sucos", "aguas-refri", "energeticos"].includes(slug))
    return "sem-alcool";
  if (slug === "happy-hour") return "happy";
  return "bar";
}

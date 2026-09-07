import { notFound } from "next/navigation";
import { MenuExperience } from "@/components/menu-experience";
import { menu } from "@/lib/menu-data";
import { getTheme, themes } from "@/lib/themes";

export const dynamicParams = false;
export function generateStaticParams() {
  return themes.map((theme) => ({ variant: `cardapio${theme.id}` }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ variant: string }>;
}) {
  const theme = getTheme((await params).variant);
  return {
    title: theme
      ? `${theme.name} | Dos Bacanas Bar`
      : "Cardápio não encontrado",
  };
}
export default async function ThemePage({
  params,
}: {
  params: Promise<{ variant: string }>;
}) {
  const theme = getTheme((await params).variant);
  if (!theme) notFound();
  return <MenuExperience initialMenu={menu} variant={theme.id} />;
}

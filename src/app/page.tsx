import { MenuExperience } from "@/components/menu-experience";
import { menu } from "@/lib/menu-data";

export default function Home() {
  return <MenuExperience initialMenu={menu} />;
}

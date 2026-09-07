import { menu } from "@/lib/menu-data";
export function GET() {
  return Response.json(menu, { headers: { "Cache-Control": "no-store" } });
}

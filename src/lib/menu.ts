import type snapshot from "@/data/menu.json";
import type { MenuAlert, HappyHourSlot } from "@/data/mock-config";

export type Category = (typeof snapshot.categories)[number];
export type Product = Omit<(typeof snapshot.products)[number], "image"> & {
  image?: string;
};
export type MenuData = {
  categories: Category[];
  products: Product[];
  schedule: HappyHourSlot[];
  alerts: MenuAlert[];
};
export const links = {
  home: "https://dosbacanas.com.br/",
  whatsapp:
    "https://wa.me/5515991768004?text=Ol%C3%A1%2C%20gostaria%20de%20falar%20com%20o%20Dos%20Bacanas.",
  review: "https://g.page/r/CTb9K02DwfxQEBM/review",
  map: "https://www.google.com/maps/search/?api=1&query=Dos+Bacanas+Bar+Av.+S%C3%A3o+Francisco+343+Sorocaba",
};
const currency = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});
export const money = (value: number) => currency.format(value);
export const normalize = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("pt-BR");
export function hasOffer(product: Product) {
  return product.promo_price !== null && product.promo_price > 0;
}
export function isHappyHour(schedule: HappyHourSlot[], date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Sao_Paulo",
    weekday: "short",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  const value = (key: string) => parts.find((p) => p.type === key)?.value ?? "";
  const day = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(
    value("weekday"),
  );
  const time = `${value("hour")}:${value("minute")}`;
  const today = `${value("year")}-${value("month")}-${value("day")}`;
  return schedule.some(
    (slot) =>
      slot.active &&
      (slot.date ? slot.date === today : slot.days.includes(day)) &&
      time >= slot.start &&
      time < slot.end,
  );
}
export function selectProducts(
  data: MenuData,
  category: string,
  filter: string,
  query: string,
) {
  const normalized = normalize(query.trim());
  return data.products.filter((p) => {
    const c = data.categories.find((item) => item.id === p.category_id);
    return (
      (category === "all" || c?.slug === category) &&
      (filter !== "top" || p.is_top_pick) &&
      (filter !== "happy" || p.is_happy_hour) &&
      (filter !== "promo" || p.is_promo) &&
      (!normalized ||
        normalize(`${p.name} ${p.description ?? ""} ${c?.name ?? ""}`).includes(
          normalized,
        ))
    );
  });
}

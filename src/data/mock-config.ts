// Local demo. Weekly hours use the original menu's label, without calling its backend.
export type HappyHourSlot = {
  days: number[];
  start: string;
  end: string;
  active: boolean;
  date?: string;
};
export type MenuAlert = {
  id: string;
  updatedAt: string;
  title: string;
  message: string;
  type: "info" | "promo" | "novidade" | "aviso";
  expiresAt: string;
  image?: string;
  actionLabel?: string;
  actionUrl?: string;
};
export const mockConfig: { schedule: HappyHourSlot[]; alerts: MenuAlert[] } = {
  schedule: [
    { days: [1, 2, 3, 4, 5], start: "17:00", end: "20:00", active: true },
  ],
  alerts: [],
};

import type { Metadata, Viewport } from "next";
import { Barlow_Condensed, DM_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";
import "./themes.css";
const sans = DM_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});
const display = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});
const poster = Barlow_Condensed({
  variable: "--font-poster",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  display: "swap",
});
export const metadata: Metadata = {
  title: "Cardápio | Dos Bacanas Bar",
  description:
    "Bons encontros, sabores bacanas. Explore nosso cardápio de porções, tábuas, drinks, cervejas e muito mais.",
  robots: { index: false, follow: false },
  icons: { icon: "/icon.svg" },
};
export const viewport: Viewport = {
  themeColor: "#070504",
  width: "device-width",
  initialScale: 1,
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="pt-BR"
      className={`${sans.variable} ${display.variable} ${poster.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}

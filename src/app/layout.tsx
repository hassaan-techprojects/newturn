import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NewTurn — Give Your 5G Phone a Better Next Turn",
  description: "Get a guided valuation for your used 5G smartphone and arrange pickup in Bengaluru.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><head><link rel="preconnect" href="https://fonts.googleapis.com"/><link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous"/><link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Space+Grotesk:wght@400;500;600;700&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet"/></head><body>{children}</body></html>;
}

import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NewTurn — Give Your 5G Phone a Better Next Turn",
  description: "Get a guided valuation for your used 5G smartphone and arrange pickup in Bengaluru.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}

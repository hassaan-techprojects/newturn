import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NewTurn — Sell Your Phone for the Best Price",
  description: "Get a fair value for your used 5G smartphone. Quick evaluation and doorstep pickup in Bengaluru.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}

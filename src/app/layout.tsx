import type { Metadata } from "next";
import { Inter, Cinzel, Yatra_One } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const cinzel = Cinzel({ subsets: ["latin"], weight: ["600", "800"], variable: "--font-cinzel" });
const yatraOne = Yatra_One({ subsets: ["latin"], weight: ["400"], variable: "--font-yatra" });

export const metadata: Metadata = {
  title: "Technology Club",
  description: "Technology Club, IIT Kharagpur",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${cinzel.variable} ${yatraOne.variable} antialiased min-h-screen bg-[#fdfbf7] text-slate-800 font-sans selection:bg-amber-200 selection:text-amber-900 overflow-x-hidden`}
      >
        {children}
      </body>
    </html>
  );
}

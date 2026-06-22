import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import { SearchDialogRoot } from "@/components/search-dialog-root";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin", "cyrillic"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-serif",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "JANJUREK — Мемориальный архив семьи",
  description:
    "Мемориальный сайт JANJUREK: бережное хранение семейных историй и родовых связей.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body className={`${inter.variable} ${cormorant.variable} min-h-screen`}>
        <SearchDialogRoot>{children}</SearchDialogRoot>
      </body>
    </html>
  );
}

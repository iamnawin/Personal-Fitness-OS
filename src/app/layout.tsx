import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { brand } from "@/lib/brand";
import { BottomNav } from "@/components/fitness/BottomNav";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: brand.productName,
  description: brand.appDescription,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} min-h-screen pb-16`}>
        <main className="mx-auto max-w-md px-4 py-6">{children}</main>
        <BottomNav />
      </body>
    </html>
  );
}

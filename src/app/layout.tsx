import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { brand } from "@/lib/brand";
import { BottomNav } from "@/components/fitness/BottomNav";
import { ErrorBoundary } from "@/components/fitness/ErrorBoundary";

const inter = Inter({ subsets: ["latin"] });

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: brand.colors.accent,
};

export const metadata: Metadata = {
  title: brand.productName,
  description: brand.appDescription,
  manifest: "/manifest.json",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} min-h-screen pb-16`}>
        <main className="mx-auto max-w-md px-4 py-6">
          <ErrorBoundary>{children}</ErrorBoundary>
        </main>
        <BottomNav />
      </body>
    </html>
  );
}

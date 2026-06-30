import type { Metadata, Viewport } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";
import { Suspense } from "react";
import { Providers } from "@/components/layout/providers";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { MobileNav } from "@/components/layout/mobile-nav";

const nunito = Nunito({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: {
    default: "AnimeFlix — Stream Anime Free",
    template: "%s · AnimeFlix",
  },
  description:
    "A modern, self-hosted anime streaming app built on Next.js and the Consumet engine. Browse trending and popular anime, search, and watch — no signup, no ads.",
  appleWebApp: { capable: true, title: "AnimeFlix", statusBarStyle: "black-translucent" },
};

export const viewport: Viewport = {
  themeColor: "#0e0e0e",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`dark ${nunito.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background pb-16 sm:pb-0">
        <Providers>
          <Suspense fallback={<div className="h-16" />}>
            <SiteHeader />
          </Suspense>
          <main className="flex-1">{children}</main>
          <SiteFooter />
          <MobileNav />
        </Providers>
      </body>
    </html>
  );
}

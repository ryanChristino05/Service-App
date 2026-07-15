// src/app/layout.tsx
import type { Metadata } from "next";
import { Fraunces, Inter, IBM_Plex_Mono } from "next/font/google";
import SessionProvider from "@/components/providers/sessionProvider";
import RootLayoutWrapper from "@/components/RootLayoutWrapper";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Local Services",
  description: "Plateforme de services locaux",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={`${fraunces.variable} ${inter.variable} ${plexMono.variable}`}>
      <body className="flex min-h-screen flex-col bg-[var(--paper)] font-[var(--font-body)] text-[var(--ink)]">
        <SessionProvider>
          <RootLayoutWrapper>{children}</RootLayoutWrapper>
        </SessionProvider>
      </body>
    </html>
  );
}
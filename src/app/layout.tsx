import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider } from "@/contexts/AuthContext";
import LanguageWrapper from "@/app/components/LanguageWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Eliksir",
  description: "Welcome to Eliksir - Board Game Community",
};

/**
 * Root layout: html/body, global fonts and app-wide providers.
 *
 * Header/Footer are provided by the route-group layouts:
 * - `(site)/layout.tsx`   — the public site
 * - `(legacy)/layout.tsx` — /impressum, /clanarine and other standalone pages
 * Pages outside a group (e.g. /under-construction) render without either.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <LanguageProvider>
      <AuthProvider>
        <LanguageWrapper geistSans={geistSans} geistMono={geistMono}>
          {children}
        </LanguageWrapper>
      </AuthProvider>
    </LanguageProvider>
  );
}

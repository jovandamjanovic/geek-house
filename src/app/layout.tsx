import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider } from "@/contexts/AuthContext";
import LanguageWrapper from "@/app/components/LanguageWrapper";
import ConditionalLayout from "@/app/components/ConditionalLayout";

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
 * Defines the root layout for the application, applying global fonts and conditionally rendering Header/Footer.
 *
 * Wraps all pages with a consistent HTML structure, including language settings and font variables.
 *
 * @param children - The content to be rendered, with conditional Header/Footer based on route
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
          <ConditionalLayout>{children}</ConditionalLayout>
        </LanguageWrapper>
      </AuthProvider>
    </LanguageProvider>
  );
}

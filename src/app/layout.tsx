import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from '../contexts/LanguageContext';
import Header from './components/header/header';
import Footer from './components/footer/footer';
import LanguageWrapper from './components/LanguageWrapper';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Geek House",
  description: "Welcome to Geek House",
};

/**
 * Defines the root layout for the application, applying global fonts and rendering the Header, Footer, and page content.
 *
 * Wraps all pages with a consistent HTML structure, including language settings and font variables.
 *
 * @param children - The content to be rendered between the Header and Footer components
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <LanguageProvider>
      <LanguageWrapper geistSans={geistSans} geistMono={geistMono}>
        <Header />
        {children}
        <Footer />
      </LanguageWrapper>
    </LanguageProvider>
  );
}

"use client";

import { useLanguage } from "@/contexts/LanguageContext";

interface LanguageWrapperProps {
  children: React.ReactNode;
  geistSans: {
    variable: string;
  };
  geistMono: {
    variable: string;
  };
}

const LanguageWrapper = ({
  children,
  geistSans,
  geistMono,
}: LanguageWrapperProps) => {
  const { locale } = useLanguage();

  return (
    <html lang={locale}>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
      </body>
    </html>
  );
};

export default LanguageWrapper;

'use client';

import { useEffect, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

interface LanguageWrapperProps {
  children: React.ReactNode;
  geistSans: {
    variable: string;
  };
  geistMono: {
    variable: string;
  };
}

const LanguageWrapper = ({ children, geistSans, geistMono }: LanguageWrapperProps) => {
  const { locale } = useLanguage();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Use a default locale during SSR to match client initial render
  const displayLocale = mounted ? locale : 'en';

  return (
    <html lang={displayLocale}>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
      </body>
    </html>
  );
};

export default LanguageWrapper;
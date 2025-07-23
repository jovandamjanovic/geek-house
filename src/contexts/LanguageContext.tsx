'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { locales, defaultLocale } from '../lib/i18n';

type Locale = typeof locales[number];

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  messages: Record<string, Record<string, string>>;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Helper function to get cookie value
function getCookie(name: string): string | undefined {
  if (typeof document === 'undefined') return undefined;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift();
  return undefined;
}

// Helper function to set cookie
function setCookie(name: string, value: string): void {
  if (typeof document === 'undefined') return;
  document.cookie = `${name}=${value}; path=/; max-age=31536000`; // 1 year
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale);
  const [messages, setMessages] = useState<Record<string, Record<string, string>>>({});

  // Load messages for current locale
  const loadMessages = async (locale: Locale) => {
    try {
      const messages = await import(`../../messages/${locale}.json`);
      setMessages(messages.default);
    } catch (error) {
      console.error('Failed to load messages for locale:', locale);
      // Fallback to default locale
      const fallbackMessages = await import(`../../messages/${defaultLocale}.json`);
      setMessages(fallbackMessages.default);
    }
  };

  // Initialize locale from cookie
  useEffect(() => {
    const savedLocale = getCookie('locale') as Locale;
    if (savedLocale && locales.includes(savedLocale)) {
      setLocaleState(savedLocale);
      loadMessages(savedLocale);
    } else {
      loadMessages(defaultLocale);
    }
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    setCookie('locale', newLocale);
    loadMessages(newLocale);
  };

  return (
    <LanguageContext.Provider value={{ locale, setLocale, messages }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
'use client';

import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { locales } from '@/lib/i18n';
import styles from './FlagLanguageSwitcher.module.css';

const flagEmojis: Record<typeof locales[number], string> = {
  en: '🇺🇸',
  es: '🇪🇸', 
  fr: '🇫🇷',
  ru: '🇷🇺',
  sr: '🇷🇸',
};

const languageNames: Record<typeof locales[number], string> = {
  en: 'English',
  es: 'Español', 
  fr: 'Français',
  ru: 'Русский',
  sr: 'Srpski',
};

const FlagLanguageSwitcher: React.FC = () => {
  const { locale: currentLocale, setLocale } = useLanguage();

  const handleLanguageClick = (locale: typeof locales[number]) => {
    setLocale(locale);
  };

  return (
    <div className={styles.container}>
      {locales.map((locale) => (
        <button
          key={locale}
          onClick={() => handleLanguageClick(locale)}
          className={`${styles.flagButton} ${currentLocale === locale ? styles.active : ''}`}
          title={languageNames[locale]}
          aria-label={`Switch to ${languageNames[locale]}`}
        >
          {flagEmojis[locale]}
        </button>
      ))}
    </div>
  );
};

export default FlagLanguageSwitcher;
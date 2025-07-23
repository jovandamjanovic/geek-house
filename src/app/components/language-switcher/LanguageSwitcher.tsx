'use client';

import React from 'react';
import {useTranslations} from '../../../hooks/useTranslations';
import {useLanguage} from '../../../contexts/LanguageContext';
import {locales} from '../../../lib/i18n';

const languageNames: Record<typeof locales[number], string> = {
  sr: 'Srpski',
  en: 'English', 
  ru: 'Русский',
  fr: 'Français',
  es: 'Español',
};

const LanguageSwitcher: React.FC = () => {
  const t = useTranslations('LanguageSwitcher');
  const { locale: currentLocale, setLocale } = useLanguage();

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLocale = e.target.value as typeof locales[number];
    setLocale(newLocale);
  };

  return React.createElement(
    'div',
    { style: { display: 'inline-block' } },
    React.createElement(
      'select',
      {
        value: currentLocale,
        onChange: handleLanguageChange,
        style: {
          padding: '8px',
          borderRadius: '4px',
          border: '1px solid #ccc',
          backgroundColor: 'white',
          cursor: 'pointer'
        }
      },
      ...locales.map((locale: typeof locales[number]) =>
        React.createElement(
          'option',
          { key: locale, value: locale },
          languageNames[locale]
        )
      )
    )
  );
};

export default LanguageSwitcher;
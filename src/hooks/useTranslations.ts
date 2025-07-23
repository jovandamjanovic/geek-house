'use client';

import { useLanguage } from '../contexts/LanguageContext';

export function useTranslations(namespace: string) {
  const { messages } = useLanguage();
  
  return (key: string): string => {
    const namespaceMessages = messages[namespace];
    if (!namespaceMessages) {
      return key; // Return key if namespace not found
    }
    
    return namespaceMessages[key] || key; // Return key if translation not found
  };
}
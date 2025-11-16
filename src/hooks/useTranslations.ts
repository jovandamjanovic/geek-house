"use client";

import { useLanguage } from "@/contexts/LanguageContext";

function getNestedValue(
  obj: Record<string, unknown>,
  path: string,
): string | undefined {
  return path.split(".").reduce((current, key) => {
    return current && typeof current === "object"
      ? (current as Record<string, unknown>)[key]
      : undefined;
  }, obj as unknown) as string | undefined;
}

export function useTranslations(namespace?: string) {
  const { messages } = useLanguage();

  return (key: string): string => {
    // If namespace is provided, look in that namespace first
    if (namespace) {
      const namespaceMessages = messages[namespace];
      if (namespaceMessages) {
        // Handle nested keys within the namespace
        const nestedValue = getNestedValue(namespaceMessages, key);
        if (nestedValue) {
          return nestedValue;
        }
      }
    }

    // Handle global nested keys (e.g., "ContactForm.errors.nameRequired")
    const globalNestedValue = getNestedValue(messages, key);
    if (globalNestedValue) {
      return globalNestedValue;
    }

    return key; // Return key if translation not found
  };
}

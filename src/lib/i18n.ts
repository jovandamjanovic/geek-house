import { getRequestConfig } from "next-intl/server";

export const locales = ["sr", "en", "ru", "fr", "es"] as const;
export const defaultLocale = "sr" as const;

export default getRequestConfig(async () => {
  // Always use default locale for server-side rendering
  // Client-side language switching will be handled separately
  const locale = defaultLocale;

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});

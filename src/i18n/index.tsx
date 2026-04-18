"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { type Locale, defaultLocale, languages } from "./languages";

import en from "./translations/en.json";
import de from "./translations/de.json";
import cs from "./translations/cs.json";
import tr from "./translations/tr.json";
import es from "./translations/es.json";

type TranslationDict = typeof en;

const dictionaries = { en, de, cs, tr, es } as Record<Locale, TranslationDict>;

const STORAGE_KEY = "pp_locale";

/**
 * Resolve a dotted key like "nav.home" from a nested object.
 */
function resolve(obj: Record<string, unknown>, path: string): string {
  const parts = path.split(".");
  let current: unknown = obj;
  for (const part of parts) {
    if (current == null || typeof current !== "object") return path;
    current = (current as Record<string, unknown>)[part];
  }
  return typeof current === "string" ? current : path;
}

interface I18nContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
  languages: typeof languages;
}

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved && dictionaries[saved as Locale]) {
          return saved as Locale;
        }
      } catch { /* OBS browser source */ }
    }
    return defaultLocale;
  });

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    try {
      localStorage.setItem(STORAGE_KEY, newLocale);
    } catch {
      // localStorage unavailable
    }
  }, []);

  const t = useCallback(
    (key: string): string => {
      // Try the current locale, fall back to English
      const result = resolve(dictionaries[locale] as unknown as Record<string, unknown>, key);
      if (result !== key) return result;
      return resolve(dictionaries.en as unknown as Record<string, unknown>, key);
    },
    [locale],
  );

  return (
    <I18nContext.Provider value={{ locale, setLocale, t, languages }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useTranslation() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useTranslation must be used within I18nProvider");
  return ctx;
}

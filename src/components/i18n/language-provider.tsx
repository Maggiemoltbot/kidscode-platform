"use client";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { NextIntlClientProvider, useLocale, useTranslations } from "next-intl";
import de from "../../../messages/de.json";
import en from "../../../messages/en.json";
import fr from "../../../messages/fr.json";
import { isLanguage, type Language } from "@/lib/tts";

const dictionaries = { de, en, fr };
const LanguageContext = createContext<(language: Language) => void>(() => undefined);
const messageKeys = new Map(Object.entries(de.ui).map(([key, value]) => [value, key]));

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("de");
  useEffect(() => {
    try {
      const saved = localStorage.getItem("kidscode-language");
      if (isLanguage(saved)) setLanguage(saved);
    } catch { /* Sprache bleibt ohne Speicher für diese Sitzung wählbar. */ }
  }, []);
  useEffect(() => { document.documentElement.lang = language; }, [language]);
  function updateLanguage(value: Language) {
    setLanguage(value);
    try { localStorage.setItem("kidscode-language", value); } catch { /* Optionaler Speicher. */ }
  }
  return <LanguageContext.Provider value={updateLanguage}>
    <NextIntlClientProvider locale={language} messages={dictionaries[language]} timeZone="Europe/Berlin">{children}</NextIntlClientProvider>
  </LanguageContext.Provider>;
}

export function useLanguage() { return useLocale() as Language; }

export function LanguageSwitcher() {
  const language = useLanguage();
  const setLanguage = useContext(LanguageContext);
  return <div role="group" aria-label="Deutsch / English / Français" className="flex items-center rounded-full bg-muted/70 p-0.5">
    {([ ["de", "🇩🇪", "Deutsch"], ["en", "🇬🇧", "English"], ["fr", "🇫🇷", "Français"] ] as const).map(([value, flag, label]) =>
      <button key={value} type="button" lang={value} aria-label={label} title={label} aria-pressed={language === value} onClick={() => setLanguage(value)}
        className={`flex size-11 items-center justify-center rounded-full text-xl transition ${language === value ? "bg-card shadow-sm" : "hover:bg-card/60"}`}>{flag}</button>)}
  </div>;
}

export function useText() {
  const t = useTranslations("ui");
  return (message: string, values?: Record<string, string | number>) => {
    const key = messageKeys.get(message);
    return key ? t(key, values) : message;
  };
}

export function Text({ message, values }: { message: string; values?: Record<string, string | number> }) {
  const translate = useText();
  return <>{translate(message, values)}</>;
}

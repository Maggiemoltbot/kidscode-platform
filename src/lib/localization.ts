import type { Language } from "./tts";

export type LocalizedFields = {
  title_en?: string | null; title_fr?: string | null;
  description_en?: string | null; description_fr?: string | null;
  theory_en?: string | null; theory_fr?: string | null;
  question_en?: string | null; question_fr?: string | null;
  hint_en?: string | null; hint_fr?: string | null;
};
const fields = ["title", "description", "theory", "question", "hint"] as const;

// Whitelist: Antworten und andere interne Daten niemals in Client-DTOs kopieren.
export function translatedFields(source: LocalizedFields): LocalizedFields {
  const result: LocalizedFields = {};
  for (const field of fields) for (const language of ["en", "fr"] as const) {
    const key = `${field}_${language}` as const;
    if (source[key]) result[key] = source[key];
  }
  return result;
}

export function localize<T>(value: T, language: Language): T {
  if (language === "de" || value === null || typeof value !== "object") return value;
  if (Array.isArray(value)) return value.map((item) => localize(item, language)) as T;
  const source = value as Record<string, unknown>;
  const result = Object.fromEntries(Object.entries(source).map(([key, item]) => [key, localize(item, language)]));
  for (const field of fields) if (typeof source[`${field}_${language}`] === "string" && source[`${field}_${language}`]) result[field] = source[`${field}_${language}`];
  // Optionen bleiben kanonisch; nur ihre Anzeige wird separat übersetzt.
  return result as T;
}

export type Language = "de" | "en" | "fr";
export type WordTiming = { word: string; start: number; end: number };
export type TTSResponse = { audio_base64: string; word_timings: WordTiming[] };
export type Alignment = {
  characters: string[];
  character_start_times_seconds: number[];
  character_end_times_seconds: number[];
};

export function isLanguage(value: unknown): value is Language {
  return value === "de" || value === "en" || value === "fr";
}

// Nur Originaltext ausrichten: normalisierte Zahlen könnten andere Wörter erzeugen.
export function wordsFromAlignment(text: string, alignment?: Alignment): WordTiming[] {
  if (!alignment || alignment.characters.join("") !== text ||
      alignment.characters.length !== alignment.character_start_times_seconds.length ||
      alignment.characters.length !== alignment.character_end_times_seconds.length) return [];
  const words: WordTiming[] = [];
  let word = "";
  let start = 0;
  let end = 0;
  for (let index = 0; index < alignment.characters.length; index++) {
    const character = alignment.characters[index];
    const from = alignment.character_start_times_seconds[index];
    const to = alignment.character_end_times_seconds[index];
    if (!Number.isFinite(from) || !Number.isFinite(to) || from < 0 || to < from) return [];
    if (/^\s+$/.test(character)) {
      if (word) words.push({ word, start, end });
      word = "";
    } else {
      if (!word) start = from;
      word += character;
      end = to;
    }
  }
  if (word) words.push({ word, start, end });
  return words;
}

export const feedback: Record<Language, { correct: string[]; incorrect: string[] }> = {
  de: {
    correct: ["Super gemacht! Du hast es richtig!", "Fantastisch! Weiter so!", "Klasse! Das hast du toll gelöst!", "Richtig! Du machst tolle Fortschritte!"],
    incorrect: ["Fast! Versuch es noch mal.", "Nicht ganz – du schaffst das!", "Bleib dran! Schau dir den Tipp an.", "Noch ein Versuch! Du kannst das!"],
  },
  en: {
    correct: ["Great job! That's correct!", "Awesome! You got it!", "Well done! Keep going!", "Fantastic! You're making great progress!"],
    incorrect: ["Not quite! Try again.", "Almost there – keep going!", "You can do it! Have a look at the hint.", "One more try! You've got this!"],
  },
  fr: {
    correct: ["Bravo ! C'est correct !", "Excellent ! Continue !", "Super ! Tu as réussi !", "Fantastique ! Tu progresses bien !"],
    incorrect: ["Presque ! Réessaie.", "Pas tout à fait – tu peux le faire !", "Courage ! Regarde l'indice.", "Encore un essai ! Tu vas y arriver !"],
  },
};

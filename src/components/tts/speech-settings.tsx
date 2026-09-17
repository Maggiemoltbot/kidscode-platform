"use client";
import { useEffect, useState } from "react";
import { type Language } from "@/lib/tts";

export function useSpeechSettings() {
  const [autoplay, setAutoplay] = useState(false);
  const [readOptions, setReadOptions] = useState(false);
  useEffect(() => {
    try {
      setAutoplay(localStorage.getItem("kidscode-speech-autoplay") === "true");
      setReadOptions(localStorage.getItem("kidscode-speech-options") === "true");
    } catch { /* Gesperrter Speicher: Einstellungen gelten für diese Seite. */ }
  }, []);
  function update(key: "autoplay" | "options", value: boolean) {
    if (key === "autoplay") setAutoplay(value); else setReadOptions(value);
    try { localStorage.setItem(`kidscode-speech-${key}`, String(value)); } catch { /* Optionaler Speicher. */ }
  }
  return { autoplay, readOptions, update };
}

export function SpeechSettings({ language, settings, options = false }: {
  language: Language; settings: ReturnType<typeof useSpeechSettings>; options?: boolean;
}) {
  const labels = {
    de: ["Automatisch vorlesen", "Antwortmöglichkeiten mit vorlesen"],
    en: ["Read aloud automatically", "Read answer options too"],
    fr: ["Lecture automatique", "Lire aussi les réponses"],
  }[language];
  return <div className="my-3 flex flex-wrap gap-4 text-sm text-muted-foreground">
    <label className="flex min-h-11 items-center gap-2"><input type="checkbox" checked={settings.autoplay} onChange={(e) => settings.update("autoplay", e.target.checked)} />{labels[0]}</label>
    {options && <label className="flex min-h-11 items-center gap-2"><input type="checkbox" checked={settings.readOptions} onChange={(e) => settings.update("options", e.target.checked)} />{labels[1]}</label>}
  </div>;
}

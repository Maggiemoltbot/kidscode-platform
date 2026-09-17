"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Loader2, Pause, Play } from "lucide-react";
import { type Language, type TTSResponse, type WordTiming } from "@/lib/tts";
import { cn } from "@/lib/utils";

interface TTSPlayerProps {
  text: string;
  language: Language;
  autoplay?: boolean;
  size?: "sm" | "md";
}

const labels = {
  de: { play: "Vorlesen", pause: "Pause", unavailable: "Audio gerade nicht verfügbar. Du kannst den Text weiter lesen.", blocked: "Tippe auf Vorlesen, um Audio zu aktivieren." },
  en: { play: "Read aloud", pause: "Pause", unavailable: "Audio is unavailable. You can keep reading the text.", blocked: "Tap Read aloud to enable audio." },
  fr: { play: "Écouter", pause: "Pause", unavailable: "Audio indisponible. Tu peux continuer à lire le texte.", blocked: "Appuie sur Écouter pour activer l'audio." },
};
let activePlayer: (() => void) | null = null;
let sharedContext: AudioContext | null = null;

export function TTSPlayer({ text, language, autoplay = false, size = "md" }: TTSPlayerProps) {
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<"unavailable" | "blocked" | null>(null);
  const [wordIndex, setWordIndex] = useState(-1);
  const context = useRef<AudioContext | null>(null);
  const buffer = useRef<AudioBuffer | null>(null);
  const source = useRef<AudioBufferSourceNode | null>(null);
  const timings = useRef<WordTiming[]>([]);
  const offset = useRef(0);
  const started = useRef(0);
  const frame = useRef(0);
  const controller = useRef<AbortController | null>(null);
  const generation = useRef(0);
  const busy = useRef(false);

  const pause = useCallback(() => {
    if (source.current && context.current) {
      offset.current += (context.current.currentTime - started.current) * 0.8;
      source.current.onended = null;
      source.current.stop();
      source.current = null;
    }
    cancelAnimationFrame(frame.current);
    setPlaying(false);
  }, []);

  const play = useCallback(async (automatic = false) => {
    if (busy.current || source.current) return;
    const version = generation.current;
    busy.current = true;
    setLoading(true);
    setMessage(null);
    try {
      sharedContext ??= new AudioContext();
      context.current = sharedContext;
      const audio = context.current;
      if (audio.state === "suspended") {
        if (automatic) { setMessage("blocked"); return; }
        await audio.resume();
      }
      activePlayer?.();
      activePlayer = pause;
      if (!buffer.current) {
        controller.current = new AbortController();
        const response = await fetch("/api/tts", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text, language }), signal: controller.current.signal,
        });
        if (!response.ok) throw new Error("Audio fehlt");
        const data = await response.json() as TTSResponse;
        const bytes = Uint8Array.from(atob(data.audio_base64), (character) => character.charCodeAt(0));
        const decoded = await audio.decodeAudioData(bytes.buffer);
        if (version !== generation.current) return;
        buffer.current = decoded;
        timings.current = data.word_timings;
      }
      if (version !== generation.current || activePlayer !== pause) return;
      if (offset.current >= buffer.current.duration) offset.current = 0;
      const node = audio.createBufferSource();
      node.buffer = buffer.current;
      node.playbackRate.value = 0.8;
      node.connect(audio.destination);
      source.current = node;
      started.current = audio.currentTime;
      node.onended = () => {
        source.current = null;
        offset.current = 0;
        cancelAnimationFrame(frame.current);
        setPlaying(false);
        setWordIndex(-1);
      };
      node.start(0, offset.current);
      setPlaying(true);
      const tick = () => {
        const time = offset.current + (audio.currentTime - started.current) * 0.8;
        setWordIndex(timings.current.findIndex((word) => time >= word.start && time < word.end));
        frame.current = requestAnimationFrame(tick);
      };
      tick();
    } catch (error) {
      if (version === generation.current && !(error instanceof DOMException && error.name === "AbortError")) setMessage("unavailable");
    } finally {
      if (version === generation.current) { busy.current = false; setLoading(false); }
    }
  }, [text, language, pause]);

  useEffect(() => {
    generation.current++;
    busy.current = false;
    buffer.current = null;
    timings.current = [];
    offset.current = 0;
    setWordIndex(-1);
    setLoading(false);
    setMessage(null);
    if (autoplay) void play(true);
    return () => {
      generation.current++;
      controller.current?.abort();
      pause();
      if (activePlayer === pause) activePlayer = null;
      context.current = null;
    };
  }, [autoplay, play, pause]);

  let index = -1;
  return (
    <div className="space-y-3" lang={language}>
      <p className={cn("whitespace-pre-wrap leading-8", size === "sm" ? "text-base" : "text-lg")}>
        {text.split(/(\s+)/).map((token, tokenIndex) => {
          if (!token || /^\s+$/.test(token)) return token;
          index++;
          return <span key={tokenIndex} className={cn("rounded transition-colors duration-100", index === wordIndex && "bg-primary/10 font-bold text-primary")}>{token}</span>;
        })}
      </p>
      <button type="button" disabled={loading} onClick={() => playing ? pause() : void play()}
        className="inline-flex min-h-11 items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary transition active:scale-96 disabled:opacity-60"
        aria-label={playing ? labels[language].pause : labels[language].play} aria-pressed={playing}>
        {loading ? <Loader2 className="size-4 animate-spin" /> : playing ? <Pause className="size-4" /> : <Play className="size-4" />}
        {playing ? labels[language].pause : labels[language].play} <span className="opacity-70">0.8×</span>
      </button>
      {message && <p role="status" className="text-sm text-muted-foreground">{labels[language][message]}</p>}
    </div>
  );
}

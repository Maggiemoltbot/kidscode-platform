import { createHash, randomUUID } from "node:crypto";
import { mkdir, readFile, rename, stat, writeFile } from "node:fs/promises";
import { NextRequest, NextResponse } from "next/server";
import { isLanguage, wordsFromAlignment, type Alignment, type TTSResponse } from "@/lib/tts";

export const runtime = "nodejs";
const pending = new Map<string, Promise<TTSResponse>>();
const cacheDirectory = "/tmp/tts-cache";
let windowStart = Date.now();
let calls = 0;

export async function POST(request: NextRequest) {
  const origin = request.headers.get("origin");
  let allowedOrigin = !origin || origin === request.nextUrl.origin;
  try { allowedOrigin ||= Boolean(origin && new URL(origin).host === request.headers.get("host")); } catch { /* Ungültiger Origin. */ }
  if (!allowedOrigin) {
    return NextResponse.json({ error: "origin" }, { status: 403 });
  }
  // Begrenzung vor JSON-Parsing, auch für Requests ohne Content-Length.
  const reader = request.body?.getReader();
  if (!reader) return NextResponse.json({ error: "body" }, { status: 400 });
  let raw = "";
  let bytes = 0;
  const decoder = new TextDecoder();
  while (true) {
    const chunk = await reader.read();
    if (chunk.done) break;
    bytes += chunk.value.byteLength;
    if (bytes > 16_000) {
      await reader.cancel();
      return NextResponse.json({ error: "length" }, { status: 413 });
    }
    raw += decoder.decode(chunk.value, { stream: true });
  }
  raw += decoder.decode();
  let body: { text?: unknown; language?: unknown };
  try { body = JSON.parse(raw); } catch { return NextResponse.json({ error: "body" }, { status: 400 }); }
  if (!body || typeof body.text !== "string" || !body.text.trim() || body.text.length > 3000 || !isLanguage(body.language)) {
    return NextResponse.json({ error: "input" }, { status: 400 });
  }
  const { text, language } = body;
  const voice = language === "de" ? "ThT5KcBeYPX3keUQqHPh" : "EXAVITQu4vr4xnSDxMaL";
  const model = language === "de" ? "eleven_multilingual_v2" : "eleven_flash_v2_5";
  const key = createHash("sha256").update(JSON.stringify([2, text, language, voice, model])).digest("hex");
  const file = `${cacheDirectory}/${key}.json`;
  try {
    if (Date.now() - (await stat(file)).mtimeMs < 7 * 86_400_000) {
      const cached = JSON.parse(await readFile(file, "utf8")) as TTSResponse;
      if (cached.audio_base64 && Array.isArray(cached.word_timings)) return NextResponse.json(cached, { headers: { "Cache-Control": "no-store" } });
    }
  } catch { /* Cache-Miss oder nicht lesbarer Cache: Audio neu erzeugen. */ }
  if (!process.env.ELEVENLABS_API_KEY) return NextResponse.json({ error: "unavailable" }, { status: 503 });
  if (Date.now() - windowStart > 60_000) { windowStart = Date.now(); calls = 0; }
  if (!pending.has(key) && calls >= 12) return NextResponse.json({ error: "rate_limit" }, { status: 429, headers: { "Retry-After": "60" } });
  try {
    if (!pending.has(key)) {
      calls++;
      const task = (async () => {
        const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voice}/with-timestamps`, {
          method: "POST",
          headers: { "xi-api-key": process.env.ELEVENLABS_API_KEY!, "Content-Type": "application/json" },
          body: JSON.stringify({ text, model_id: model, ...(language === "de" ? {} : { language_code: language }) }),
          signal: AbortSignal.timeout(20_000),
        });
        if (!response.ok) throw new Error("TTS nicht verfügbar");
        const data = await response.json() as { audio_base64?: string; alignment?: Alignment };
        if (!data.audio_base64) throw new Error("Audio fehlt");
        const result = { audio_base64: data.audio_base64, word_timings: wordsFromAlignment(text, data.alignment) };
        try {
          await mkdir(cacheDirectory, { recursive: true, mode: 0o700 });
          const temporary = `${file}.${randomUUID()}.tmp`;
          await writeFile(temporary, JSON.stringify(result), { mode: 0o600 });
          await rename(temporary, file);
        } catch { /* Ein Cache-Fehler darf erfolgreich erzeugtes Audio nicht verwerfen. */ }
        return result;
      })();
      pending.set(key, task);
      void task.finally(() => pending.delete(key)).catch(() => undefined);
    }
    return NextResponse.json(await pending.get(key), { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ error: "unavailable" }, { status: 503 });
  }
}

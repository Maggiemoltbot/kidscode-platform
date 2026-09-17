# Astra — KidsCode M9: Apple Design + TTS + Mehrsprachigkeit + Fixes

Du bist Astra, autonomer Full-Stack-Agent. Projekt: `/Users/rudi/Projects/kidscode-platform`
**Dev-Server läuft auf Port 3001 — NICHT stoppen, läuft parallel!**
Starte keinen neuen Dev-Server auf Port 3001. Falls du testen willst: `npm run build` reicht.

Lies zuerst: `KONZEPT.md`, `HANDOVER_M8.md`, `KIDSCODE_FINAL_REPORT.md`

---

## FEEDBACK VON RUDI (Priorität hoch → niedrig)

1. **Umlaut-Bug** — Umlaute werden als UE/AE/OE angezeigt → sofort fixen
2. **Apple Design System** — kompletter UI-Overhaul nach Apple HIG
3. **TTS mit Karaoke-Highlighting** — ElevenLabs vorliest, Wort wird highlighted
4. **3 Sprachen** — Deutsch / Englisch / Französisch
5. **Antworten randomisieren** — richtige Antwort NICHT immer erste

---

## M9A — SOFORT-FIX: Umlaut-Bug (30 min)

Das ist Bug #1 — als erstes!

**Diagnose:** Finde alle Stellen wo Umlaute (ä/ö/ü/Ä/Ö/Ü/ß) als AE/OE/UE gerendert werden.
```bash
cd /Users/rudi/Projects/kidscode-platform
grep -r "AE\|OE\|UE\|ae\|oe\|ue" src/ prisma/seed.ts --include="*.ts" --include="*.tsx" | grep -v node_modules | head -20
```

Wahrscheinliche Ursachen:
- Prisma seed.ts enthält ASCII-Ersetzungen statt echter UTF-8-Umlaute
- `charset` fehlt in HTML-head (next.js layout.tsx)
- Font lädt latin subset ohne extended chars

**Fix:**
1. `layout.tsx` — prüfe `<html lang="de">` und `<meta charset="UTF-8">`
2. `prisma/seed.ts` — ersetze ALLE `ae/oe/ue/Ae/Oe/Ue/ss` durch echte Umlaute ä/ö/ü/Ä/Ö/Ü/ß
3. Font-Import: `next/font/google` mit `subsets: ['latin', 'latin-ext']`
4. Nach Fix: `npm run db:seed` erneut ausführen
5. `npm run build` → 0 errors

Commit: `fix: Umlaut-Encoding, charset, font latin-ext`
HANDOVER: `HANDOVER_M9A.md`

---

## M9B — APPLE DESIGN SYSTEM (2-3h)

KidsCode soll sich anfühlen wie eine native Apple-App — clean, viel Whitespace, SF Pro, blur-glass-Effekte, subtile Animationen.

### Design-Tokens (tailwind.config.ts erweitern)
```ts
// Neue Design-Tokens
colors: {
  apple: {
    blue:   '#007AFF',
    purple: '#AF52DE',
    orange: '#FF9500',
    green:  '#34C759',
    red:    '#FF3B30',
    yellow: '#FFCC00',
    bg:     '#F2F2F7',    // iOS systemGroupedBackground
    card:   '#FFFFFF',
    label:  '#000000',
    secondary: '#3C3C43',
    tertiary:  '#3C3C4399',
  }
},
borderRadius: {
  apple: '13px',   // iOS card radius
  'apple-xl': '20px',
  'apple-2xl': '28px',
},
```

### Typografie — SF Pro via System-Font-Stack
```ts
// layout.tsx — kein Google Font nötig, SF Pro ist system-font auf Apple
fontFamily: {
  sans: ['-apple-system', 'BlinkMacSystemFont', 'SF Pro Display', 'SF Pro Text', 'system-ui', 'sans-serif'],
  mono: ['SF Mono', 'ui-monospace', 'Menlo', 'monospace'],
}
```

### Komponenten-Überarbeitung

**GlobalLayout (layout.tsx):**
- Background: `bg-[#F2F2F7]` (iOS systemGroupedBackground)
- Header: backdrop-blur-xl, bg-white/70, border-b border-gray-200/50 (iOS NavigationBar style)
- Keine Schatten mit harten Kanten — nur `shadow-sm` oder `drop-shadow-sm`

**Cards (überall):**
- `rounded-[20px] bg-white shadow-sm` (kein border!)
- Padding: `p-5` oder `p-6`
- Hover: `hover:shadow-md transition-shadow duration-200`

**Buttons:**
- Primary: `bg-[#007AFF] text-white rounded-full px-6 py-3 font-semibold text-[17px]` (SF Pro Button Style)
- Danger: `bg-[#FF3B30]`
- Secondary: `bg-[#F2F2F7] text-[#007AFF]`
- Kein border, kein outline

**Antwort-Buttons (Multiple Choice):**
```
Normaler Zustand: bg-white border border-gray-200 rounded-[13px] p-4
Hover: border-[#007AFF] bg-blue-50/30
Richtig: bg-[#34C759]/10 border-[#34C759] text-[#34C759]
Falsch: bg-[#FF3B30]/10 border-[#FF3B30] text-[#FF3B30] + shake-animation
```

**Fortschrittsbalken:**
- `h-1.5 rounded-full bg-gray-200` mit `bg-[#007AFF]` fill
- Animate mit Framer Motion `scaleX` transform

**XP / Badge Chips:**
- `bg-[#AF52DE]/10 text-[#AF52DE] rounded-full px-3 py-1 text-sm font-medium`

**Maskottchen-Sprechblase:**
- Glassmorphism: `backdrop-blur-xl bg-white/80 rounded-[20px] border border-white/50 shadow-lg`

**Animationen (Framer Motion):**
- Page transitions: `opacity: 0→1, y: 20→0, duration: 0.3`
- Card hover: `scale: 1→1.02, duration: 0.15`
- Button tap: `scale: 0.96, duration: 0.1`
- Konfetti bei richtig: 20 Partikel, bunte Apple-Farben, spread 360°

**Dark Mode (optional aber nice):**
- `dark:bg-[#1C1C1E]` (iOS systemBackground dark)
- `dark:bg-[#2C2C2E]` (iOS secondarySystemBackground dark)
- via `next-themes`

Commit: `feat(M9B): Apple Design System, SF Pro, glass-morphism, neue Farben`
HANDOVER: `HANDOVER_M9B.md`

---

## M9C — TTS MIT KARAOKE-HIGHLIGHTING (2h)

ElevenLabs liest Lektionen und Fragen vor. Jedes gesprochene Wort wird highlighted.

### API-Setup
ElevenLabs API Key liegt in `~/.hermes/.env` als `ELEVENLABS_API_KEY`.
In `/Users/rudi/Projects/kidscode-platform/.env.local` eintragen:
```bash
# Lese den Key und schreibe ihn in .env.local
ELEVENLABS_API_KEY=$(grep ELEVENLABS_API_KEY /Users/rudi/.hermes/.env | cut -d'=' -f2)
echo "ELEVENLABS_API_KEY=$ELEVENLABS_API_KEY" >> /Users/rudi/Projects/kidscode-platform/.env.local
```

### TTS-Komponente bauen: `src/components/tts/tts-player.tsx`

Features:
1. **Text-to-Speech** via ElevenLabs API (Model: `eleven_flash_v2_5`, Voice: kindgerechte Stimme)
   - Voice ID für Kinder: `EXAVITQu4vr4xnSDxMaL` (Rachel — klar, freundlich) oder `pNInz6obpgDQGcFmaJgB` (Adam)
   - Für Deutsch: `eleven_multilingual_v2`
2. **Word-Timing via `/v1/text-to-speech/{voice_id}/with-timestamps`** — gibt `alignment.characters` und `alignment.character_start_times_seconds` zurück
3. **Karaoke-Rendering:**
   - Text in `<span>`-Tokens aufteilen (nach Leerzeichen)
   - Während Playback: aktuelles Wort bekommt `font-weight: 700, color: #007AFF, background: #007AFF/10, rounded`
   - Übergang: smooth mit `transition-all duration-100`
4. **Audio-Playback** via Web Audio API (Base64-decode des ElevenLabs-Response)
5. **Controls:** Play/Pause-Button mit Apple-Style SF Symbol (▶ / ⏸), Geschwindigkeit 0.8x für Kinder

```tsx
// Interface
interface TTSPlayerProps {
  text: string;
  language: 'de' | 'en' | 'fr';
  autoplay?: boolean;
  size?: 'sm' | 'md';
}
```

### Integration in Lektions-Screens

**Theorie-Screen** (`lesson-theory-view.tsx`):
- TTS-Player unter dem Erklärungstext
- Autoplay optional (User-Setting)
- Karaoke: Theorie-Text wird Wort für Wort highlighted

**Exercise-Screen** (Multiple Choice + Code):
- Frage wird automatisch vorgelesen wenn Screen öffnet
- Antwort-Optionen werden mit kleiner Pause nacheinander vorgelesen (optional, Toggle)
- Bei **richtig**: fröhlicher kurzer Satz wird vorgelesen:
  - DE: "Super gemacht! Du hast es richtig!" / "Fantastisch! Weiter so!"
  - EN: "Great job! That's correct!" / "Awesome! You got it!"
  - FR: "Bravo! C'est correct!" / "Excellent! Continue!"
- Bei **falsch**: ermutigender Satz:
  - DE: "Fast! Versuch es noch mal." / "Nicht ganz — du schaffst das!"
  - EN: "Not quite! Try again." / "Almost there — keep going!"
  - FR: "Presque! Réessaie." / "Pas tout à fait — tu peux le faire!"
- 3-4 Variationen zufällig wählen (nicht immer derselbe Satz)

### Server-Side API Route: `src/app/api/tts/route.ts`
```ts
// POST /api/tts
// Body: { text: string, language: 'de'|'en'|'fr' }
// Returns: { audio_base64: string, word_timings: Array<{word, start, end}> }
```
- Ruft ElevenLabs `/v1/text-to-speech/{voice_id}/with-timestamps` auf
- Cached Responses (gleicher Text+Sprache → kein neuer API-Call), Cache in `/tmp/tts-cache/`
- Voice-IDs per Sprache:
  - DE: `ThT5KcBeYPX3keUQqHPh` (Dorothy — klar, warm) oder beliebige multilingual voice
  - EN: `EXAVITQu4vr4xnSDxMaL` (Rachel)
  - FR: `EXAVITQu4vr4xnSDxMaL` (Rachel ist multilingual)

Commit: `feat(M9C): ElevenLabs TTS, Karaoke-Highlighting, Feedback-Audio`
HANDOVER: `HANDOVER_M9C.md`

---

## M9D — MEHRSPRACHIGKEIT DE/EN/FR (2h)

### i18n-Setup: `next-intl` installieren
```bash
npm install next-intl
```

### Sprachdateien: `messages/de.json`, `messages/en.json`, `messages/fr.json`

Struktur:
```json
{
  "nav": { "home": "Startseite", "courses": "Kurse", "profile": "Profil" },
  "home": { "title": "KidsCode", "subtitle": "Lerne Programmieren!", "cta": "Jetzt starten!" },
  "levels": {
    "beginner": { "title": "Anfänger", "description": "..." },
    "intermediate": { "title": "Fortgeschritten", "description": "..." },
    "expert": { "title": "Experte", "description": "..." }
  },
  "exercise": {
    "correct": ["Super gemacht!", "Fantastisch!", "Richtig!", "Klasse!"],
    "incorrect": ["Fast! Versuch es noch mal.", "Nicht ganz!", "Du schaffst das!"],
    "hint": "Tipp",
    "next": "Weiter",
    "check": "Prüfen",
    "run": "Ausführen ▶"
  },
  "profile": { "xp": "XP", "streak": "Streak", "badges": "Abzeichen" }
}
```

### Sprach-Switcher
- Header rechts: 🇩🇪 / 🇬🇧 / 🇫🇷 Buttons (kleine Flaggen-Emojis)
- Auswahl in localStorage speichern
- `next-intl` mit Client-Side-Routing (kein subdomain, nur context)

### DB: Kursinhalte mehrsprachig
- `Lesson` und `Exercise` Modelle um `title_en`, `title_fr`, `theory_en`, `theory_fr`, `question_en`, `question_fr`, `options_en`, `options_fr` erweitern
- Migration: `npx prisma db push`
- Seed erweitern: englische und französische Übersetzungen für alle 64 Exercises eintragen
  (Für MVP: einfache Übersetzungen, nicht perfekt literarisch)

Commit: `feat(M9D): next-intl, DE/EN/FR, Sprachswitcher, DB-Übersetzungen`
HANDOVER: `HANDOVER_M9D.md`

---

## M9E — ANTWORTEN RANDOMISIEREN (30 min)

**Bug:** Richtige Antwort ist fast immer die erste Option.

**Fix in `src/app/api/progress/route.ts` und Exercise-Rendering:**

1. In `prisma/seed.ts`: Prüfe ob `options`-Array immer mit der richtigen Antwort an Index 0 anfängt — wenn ja, shuffle beim Seed
2. In der Exercise-Anzeige-Komponente: `options`-Array vor dem Render shufflen:
```ts
// src/lib/shuffle.ts
export function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
```
3. In der Multiple-Choice-Komponente: `const displayOptions = useMemo(() => shuffleArray(exercise.options), [exercise.id])`
4. `exercise.id` als Memo-Dep damit bei neuer Frage neu shuffled wird, aber nicht bei Re-Render

Commit: `fix: MC-Antworten shufflen, richtige Antwort nicht mehr immer erste`
HANDOVER: `HANDOVER_M9E.md`

---

## ABSCHLUSS

Nach M9A-M9E:
1. `npm run build` → 0 errors (PFLICHT)
2. `npm run typecheck` → 0 errors
3. `npm run lint` → 0 errors
4. **Dev-Server auf Port 3001 NEU STARTEN** (weil er noch der alte ist):
   ```bash
   # Alten Prozess auf 3001 finden und killen
   lsof -ti:3001 | xargs kill -9 2>/dev/null; sleep 2
   # Neu starten im Hintergrund
   cd /Users/rudi/Projects/kidscode-platform && npm run dev -- --port 3001 &
   disown
   ```
5. Git commit + push:
   ```bash
   cd /Users/rudi/Projects/kidscode-platform
   git add -A
   git commit -m "feat(M9): Apple Design, TTS Karaoke, i18n DE/EN/FR, Umlaut-Fix, MC-Shuffle"
   git config user.name "Maggiemoltbot"
   git config user.email "maggiemoltbot@users.noreply.github.com"
   # Push zu GitHub
   # Token liegt in gh CLI — nutze:
   gh auth token | git -c credential.helper='!f() { echo "username=Maggiemoltbot"; echo "password=$(gh auth token)"; }; f' push origin main
   ```
6. **Telegram an Rudi:**
   ```bash
   ~/.hermes/scripts/rudel_tg.sh "✅ KidsCode M9 fertig! Apple Design, TTS Karaoke, DE/EN/FR, Umlaut-Fix und Antwort-Shuffle deployed. Dev-Server läuft auf Port 3001 / Cloudflare-Tunnel aktiv."
   ```

## WICHTIGE CONSTRAINTS
- **Port 3001 läuft bereits** — NICHT stoppen während du entwickelst!  
- Der neue Dev-Server NUR am Ende nach dem Build neu starten (Schritt 4 oben)
- `.env.local` nie committen (liegt in .gitignore)
- `ELEVENLABS_API_KEY` aus `~/.hermes/.env` lesen (nicht hardcoden)
- TTS-Cache unter `/tmp/tts-cache/` (nicht im Repo)
- Wenn ElevenLabs-API in Tests fehlschlägt: TTS-Komponente graceful degraden (kein Audio → kein Crash)

## START JETZT

1. Zuerst M9A (Umlaut-Fix) — sofort
2. Dann M9B bis M9E in Reihenfolge
3. Am Ende Dev-Server neu starten + Push + Telegram

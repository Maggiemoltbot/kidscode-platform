# Astra — KidsCode M10: TTS-Verbesserungen + Grafische Konzept-Erklärungen + Code-Kommentare

Du bist Astra, autonomer Full-Stack-Agent.
Projekt: `/Users/rudi/Projects/kidscode-platform`
**Dev-Server läuft auf Port 3001 — NICHT stoppen!**
Default-Model: gpt-6-astra-2 / azure-astra (bereits in config.toml gesetzt)

Lies zuerst: `HANDOVER_M9.md`, `HANDOVER_M9C.md` (TTS), `KIDSCODE_FINAL_REPORT.md`

---

## FEEDBACK VON RUDI

1. **TTS-Stimme** — gefällt noch nicht, Auswahl verbessern
2. **TTS-Geschwindigkeit** — 0.8x zu langsam; Default auf 1.0, Slider einbauen
3. **ElevenLabs Language Tags** — englische Code-Keywords (if, then, for, while, print...) bei
   deutscher TTS falsch ausgesprochen → SSML `<lang xml:lang="en-US">` Tags setzen
4. **Grafische Konzept-Erklärungen** — Flow-Diagramme / Node-Visualisierungen die zeigen
   was rein- und rausgeht (z.B. für Funktionen, if/else, Schleifen)
5. **Code-Kommentar-Toggle** — Button am Code-Beispiel: Kommentare ein/aus, mit kurzer
   Erklärung was Kommentare sind

---

## M10A — TTS: Stimme + Geschwindigkeit + Language-Tags (1.5h)

### A1: Bessere Stimme wählen

ElevenLabs hat kindgerechte, warme Stimmen. Teste folgende Voice-IDs und wähle die beste
für Kinder (warm, klar, nicht zu erwachsen):

Empfehlung für Kinder-TTS:
- `cgSgspJ2msm6clMCkdW9` — Jessica (warm, freundlich)  
- `FGY2WhTYpPnrIDTdsKH5` — Laura (sanft, klar)
- `XB0fDUnXU5powFXDhCwa` — Charlotte (britisch, warm)

Teste direkt per curl:
```bash
ELKEY=$(grep ELEVENLABS_API_KEY /Users/rudi/.hermes/.env | cut -d'=' -f2 | tr -d '"')
curl -s -X POST "https://api.elevenlabs.io/v1/text-to-speech/cgSgspJ2msm6clMCkdW9" \
  -H "xi-api-key: $ELKEY" \
  -H "Content-Type: application/json" \
  -d '{"text":"Hallo! Ich bin dein Lernbegleiter. Heute lernst du Python!","model_id":"eleven_multilingual_v2","voice_settings":{"stability":0.5,"similarity_boost":0.8,"speed":1.0}}' \
  --output /tmp/test_voice.mp3 && echo "OK"
# Prüfe Dateigröße (>0 = Erfolg):
ls -lh /tmp/test_voice.mp3
```

Wähle die Voice-ID die am kindgerechtesten klingt (basierend auf Datei-Output und API-Response).
Trage die gewählte Voice-ID in `src/app/api/tts/route.ts` ein.

### A2: Geschwindigkeit-Slider einbauen

In `src/components/tts/tts-player.tsx`:

1. **Default-Speed: 1.0** (nicht 0.8)
2. **Speed-Slider** unter dem Play-Button:
   - Range: 0.7 — 1.5 (Schritt 0.1)
   - Labels: 🐢 Langsam | Normal | 🚀 Schnell
   - Apple-Style: `input[type=range]` mit custom CSS, lila Thumb
   - Wert in localStorage speichern (`kidscode-tts-speed`)
   - Beim nächsten Öffnen wiederherstellen
3. API-Route `src/app/api/tts/route.ts`: `speed`-Parameter an ElevenLabs weitergeben
   (`voice_settings.speed`)
4. Cache-Key muss Speed einschließen (`text + language + speed`)

### A3: SSML Language-Tags für Code-Keywords

Bei **deutscher TTS** werden englische Programmierwörter falsch ausgesprochen.
ElevenLabs unterstützt SSML `<lang>`-Tags im Text.

**Liste der Code-Keywords die englisch ausgesprochen werden müssen:**
```
if, else, elif, for, while, in, not, and, or, True, False, None,
print, input, return, def, class, import, from, range, len, type,
int, str, float, bool, list, dict, set, var, let, const, function,
console, log, html, css, div, span, head, body, href, src,
loop, break, continue, pass, lambda, yield, with, try, except,
finally, raise, assert, global, nonlocal, del, is
```

In `src/lib/tts-preprocessor.ts` (neu anlegen):
```ts
const CODE_KEYWORDS = ['if', 'else', 'elif', 'for', 'while', ...];

export function preprocessTTSText(text: string, language: 'de' | 'en' | 'fr'): string {
  if (language === 'en') return text; // Englisch braucht keine Tags
  
  // Code-Blöcke (in Backticks) komplett als Englisch taggen
  let processed = text.replace(/`([^`]+)`/g, (_, code) => 
    `<lang xml:lang="en-US">${code}</lang>`
  );
  
  // Einzelne Keywords im Fließtext taggen (nur als ganzes Wort)
  CODE_KEYWORDS.forEach(kw => {
    const regex = new RegExp(`\\b(${kw})\\b`, 'g');
    processed = processed.replace(regex, `<lang xml:lang="en-US">$1</lang>`);
  });
  
  return processed;
}
```

In `src/app/api/tts/route.ts`:
- `preprocessTTSText(text, language)` vor dem API-Call aufrufen
- ElevenLabs-Request: `"model_id": "eleven_multilingual_v2"` (unterstützt SSML)
- Im Request-Body: `"text"` durch preprocessed Text ersetzen

Commit: `feat(M10A): TTS Stimme, Speed-Slider, SSML Language-Tags für Code-Keywords`
HANDOVER: `HANDOVER_M10A.md`

---

## M10B — GRAFISCHE KONZEPT-ERKLÄRUNGEN (2h)

Für jede Lektion soll es optional eine grafische Visualisierung des Konzepts geben —
ein interaktives "Flow-Diagramm" das zeigt was rein- und rausgeht.

### Komponente: `src/components/lessons/concept-visual.tsx`

Verwende **React Flow** oder (leichter) eine **eigene SVG-basierte Visualisierung**:

```bash
npm install reactflow
# ODER falls zu schwer: eigene SVG-Komponenten
```

**Konzept-Typen und ihre Visualisierung:**

**1. Funktion (def)**
```
┌─────────────────────────────────┐
│  INPUT: name (Text)             │
│         ↓                       │
│  ┌─────────────────┐            │
│  │  def greet():   │            │
│  │  print("Hallo") │            │
│  └─────────────────┘            │
│         ↓                       │
│  OUTPUT: "Hallo Max!" (Text)    │
└─────────────────────────────────┘
```

**2. if/else Entscheidung**
```
        ┌─────────────┐
        │  Bedingung  │
        │  name=="Max"│
        └──────┬──────┘
         ✓ JA  │  ✗ NEIN
        ↙       ↘
  "Hallo Max!"  "Hallo Freund!"
```

**3. for-Schleife**
```
range(3) → [0, 1, 2]
    │
    ├─ i=0 → print("Stern") → ⭐
    ├─ i=1 → print("Stern") → ⭐
    └─ i=2 → print("Stern") → ⭐
```

**4. Variable**
```
┌──────────────┐     ┌─────────────┐
│  name = ...  │────▶│  "Schachtel"│
│  (Variablen- │     │  mit Label  │
│   name)      │     │  "name"     │
└──────────────┘     └─────────────┘
```

**Implementierung:**
- Baue eine `<ConceptVisual type="function"|"if_else"|"for_loop"|"variable" data={...}>` Komponente
- Nutze SVG + Framer Motion Animationen (Pfeile animieren von oben nach unten beim Einblenden)
- Apple-Style: weiße Karten, abgerundete Ecken, lila/blaue Akzente
- Toggle-Button "Konzept zeigen 🔍" / "Konzept ausblenden" in der Lektion
- In `Lesson`-Model: neues Feld `conceptType: String?` (optional) — via Prisma Migration
- Im Seed: Lektionen mit passendem `conceptType` befüllen:
  - Lektion "Variablen" → `conceptType: "variable"`
  - Lektion "if/else" → `conceptType: "if_else"`
  - Lektion "for-Schleife" → `conceptType: "for_loop"`
  - Lektion "Funktionen" → `conceptType: "function"`

Commit: `feat(M10B): Grafische Konzept-Visualisierungen (Funktion, if/else, Schleife, Variable)`
HANDOVER: `HANDOVER_M10B.md`

---

## M10C — CODE-KOMMENTAR-TOGGLE (1h)

In jedem Code-Beispiel und Code-Editor soll ein Toggle-Button erscheinen der Kommentare
ein- und ausblendet.

### Erklärungsblock (einmalig, beim ersten Einblenden der Kommentare):

```tsx
// Zeige diesen Block wenn Kommentare zum ersten Mal eingeschaltet werden:
<div className="rounded-[13px] bg-amber-50 border border-amber-200 p-4 mb-3">
  <p className="text-sm font-semibold text-amber-800">💬 Was sind Kommentare?</p>
  <p className="text-sm text-amber-700 mt-1">
    Kommentare werden vom Computer <strong>nicht ausgeführt</strong> — 
    sie sind nur Notizen für Menschen die den Code lesen. 
    In Python beginnen Kommentare mit <code>#</code>.
  </p>
</div>
```

### Toggle-Button Style (Apple):
```tsx
<button className="flex items-center gap-2 text-sm text-[#007AFF] font-medium">
  <span>{showComments ? '💬' : '💬'}</span>
  {showComments ? 'Kommentare ausblenden' : 'Kommentare einblenden'}
</button>
```

### Zwei Code-Versionen pro Beispiel

In `Exercise` und `Lesson` (theory): jedes Code-Beispiel hat zwei Versionen:
- **Ohne Kommentare** (default, clean)
- **Mit Kommentaren** (erklärt jede Zeile)

Umsetzung: in `prisma/seed.ts` Kommentare als `# ...` direkt im Code hinterlegen,
aber mit einem speziellen Marker: `##COMMENT##` am Anfang der Kommentarzeile.

In der Render-Komponente:
```ts
function filterComments(code: string, showComments: boolean): string {
  return code
    .split('\n')
    .filter(line => showComments || !line.trim().startsWith('##COMMENT##'))
    .map(line => line.replace('##COMMENT##', '#'))
    .join('\n');
}
```

In `src/components/editor/code-editor.tsx`:
1. State: `const [showComments, setShowComments] = useState(false)`
2. `const [hasSeenCommentExplanation, setHasSeenCommentExplanation] = useState(false)` (localStorage)
3. Toggle-Button oberhalb des Editors
4. Beim ersten Einschalten: Erklärungsblock einblenden (mit Framer Motion slide-down)
5. Code mit `filterComments(code, showComments)` rendern

Seed aktualisieren: für alle Code-Beispiele Kommentar-Zeilen mit `##COMMENT##` ergänzen.
Beispiel:
```python
##COMMENT## Schreibe eine Nachricht auf den Bildschirm
print("Hallo!")
##COMMENT## Das war unser erster Python-Befehl!
```

Commit: `feat(M10C): Code-Kommentar-Toggle mit Erklärungsblock`
HANDOVER: `HANDOVER_M10C.md`

---

## ABSCHLUSS M10

Nach M10A-C:
1. `npm run build` → 0 errors (PFLICHT)
2. `npm run typecheck` → 0 errors
3. Dev-Server neu starten (Port 3001):
```bash
lsof -ti:3001 | xargs kill -9 2>/dev/null; sleep 2
cd /Users/rudi/Projects/kidscode-platform && nohup npm run dev -- --port 3001 > /tmp/kidscode-dev.log 2>&1 &
disown
sleep 5 && curl -sI http://localhost:3001 | head -2
```
4. Git push:
```bash
cd /Users/rudi/Projects/kidscode-platform
git add -A
git config user.name "Maggiemoltbot"
git config user.email "maggiemoltbot@users.noreply.github.com"
git commit -m "feat(M10): TTS Speed-Slider+SSML, Konzept-Visualisierungen, Code-Kommentar-Toggle"
gh auth token | git -c credential.helper='!f() { echo "username=Maggiemoltbot"; echo "password=$(gh auth token)"; }; f' push origin main
```
5. Telegram:
```bash
~/.hermes/scripts/rudel_tg.sh "✅ KidsCode M10 fertig! TTS Speed-Slider + SSML Language-Tags, grafische Konzept-Diagramme und Code-Kommentar-Toggle sind live. Dev-Server läuft auf Port 3001."
```

## CONSTRAINTS
- Port 3001 während der Entwicklung NICHT killen
- `.env.local` nicht committen
- ElevenLabs Key: `grep ELEVENLABS_API_KEY /Users/rudi/.hermes/.env | cut -d'=' -f2 | tr -d '"'`
- Bei reactflow-Größe (>200KB bundle): Fallback auf eigene SVG-Komponenten
- TTS-Cache in `/tmp/tts-cache/` (nicht im Repo, bereits in .gitignore)

## START
Beginne mit M10A (TTS-Fixes) — der hat höchste Priorität laut Rudi.

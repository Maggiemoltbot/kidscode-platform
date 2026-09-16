# HANDOVER M6 — KidsCode Platform
Datum: 2026-09-16
Phase: M6 — Code-Editor & Lueckentext-Uebungen

## Was wurde gebaut
- `src/components/editor/code-editor.tsx`: Wiederverwendbarer CodeMirror-6-Editor fuer Python und HTML.
- `src/lib/pyodide-loader.ts`: Browser-only Pyodide-Lader mit Lazy-Load ueber CDN und freundlichen Python-Fehlermeldungen.
- `src/lib/lesson-queries.ts`: Exercise-Daten um Starter-Code fuer CODE_GAP und FREE_CODE erweitert.
- `src/components/lessons/exercise-preview.tsx`: Code-Aufgaben mit Editor, Python-Terminal, HTML-Live-Preview, Pruefen/Ausfuehren-Flow und vorhandenem XP-/Weiter-Flow integriert.
- `src/app/api/progress/route.ts`: Progress-Endpunkt bewertet jetzt neben Multiple Choice auch Code-Luecken und freie Code-Antworten.

## Getroffene Entscheidungen
- Pyodide wird per CDN erst bei Python-Ausfuehrung geladen: vermeidet initiale Bundle-Groesse und erfuellt die Lazy-Load-Vorgabe.
- Kein neues Prisma-Feld fuer Starter-Code: M6 bleibt schema-stabil; konkrete Starter-Texte liegen in `lesson-queries.ts` und werden in M8 mit den Kursinhalten weiter ausgebaut.
- HTML wird ueber ein sandboxed `iframe` live dargestellt: einfache Vorschau ohne Serverausfuehrung und ohne Script-Rechte.
- Code-Validierung nutzt den bestehenden Progress-Endpunkt: XP, Fortschritt, Wiederholschutz und Lektionsabschluss bleiben fuer alle Exercise-Typen konsistent.

## Qualitäts-Gates
- [x] npm run build → 0 errors
- [x] npm run typecheck → 0 errors
- [x] npm run lint → 0 errors

## Smoke-Test
- Temporäres Profil via `POST /api/profile` erstellt.
- `POST /api/progress` fuer `exercise-python-hallo-gap-1` mit Output `Hallo` → correct=true, +15 XP.
- `POST /api/progress` fuer `exercise-html-bausteine-gap-1` mit HTML-Code → correct=true, +15 XP.
- Route `/courses/beginner/lesson-python-hallo-welt/exercise/exercise-python-hallo-gap-1` lokal aufgerufen → HTTP 200.
- Temporäres Smoke-Profil anschliessend geloescht.

## Nächste Phase: M7
Streak- und Badge-Regeln zentralisieren, Dashboard-Animationen ergaenzen und `/leaderboard` mit Top-10-XP bauen.

## Offene Punkte
- Pyodide-CDN benoetigt beim ersten Python-Lauf Netzwerkzugriff im Browser; fuer Offline-Produktion sollten Pyodide-Assets in `public/` gespiegelt werden.

# AGENTS.md — KidsCode Platform

## Projekt-Kontext
KidsCode ist eine interaktive Web-Lernplattform für Kinder (ab 5–6 Jahre), die Programmieren
spielerisch beibringt. Stack: Next.js 14, TypeScript, Tailwind CSS, PostgreSQL/SQLite (Prisma),
Pyodide (Python im Browser), CodeMirror 6.

## Arbeitsregeln
- **Sprache:** Alle Kommentare, Commit-Messages und Docs auf Deutsch
- **Commits:** Pro Meilenstein ein sauberer Commit mit aussagekräftiger Message
- **Qualität:** TypeScript strict, ESLint ohne Errors, `npm run build` muss 0 Errors liefern
- **Autonomie:** Fragen stellen ist OK bei Architekturentscheidungen; bei UI-Details
  eigenständig entscheiden und im Handover dokumentieren

## Phasen-Struktur (HANDOVER-Pflicht)
Nach jeder Phase MUSS eine Datei `HANDOVER_M<N>.md` im Projektwurzel angelegt werden:
- Was wurde gebaut (konkret, mit Dateipfaden)
- Welche Entscheidungen wurden getroffen und warum
- Was ist der nächste konkrete Schritt (Phase M<N+1>)
- Offene Punkte / TODOs

## Tech-Stack
- Framework: Next.js 14 (App Router)
- Language: TypeScript strict
- Styling: Tailwind CSS + shadcn/ui
- DB: SQLite via Prisma (einfach, kein Server nötig)
- Python im Browser: Pyodide
- Code-Editor: CodeMirror 6
- Animationen: Framer Motion

## Qualitäts-Gates pro Phase
1. `npm run build` → 0 errors
2. `npm run typecheck` → 0 errors
3. `npm run lint` → 0 errors (warnings OK)
4. Manuelle Smoke-Test-Checkliste im HANDOVER dokumentiert

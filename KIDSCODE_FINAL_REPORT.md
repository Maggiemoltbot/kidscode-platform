# KidsCode Final Report

Datum: 2026-09-16  
Version: `v0.1.0-mvp`

## Gebauter MVP

KidsCode ist als vollständiger Next.js-14-Prototyp umgesetzt. Die App enthält eine animierte Startseite, Level-Auswahl, Kursübersichten, Theorie-Screens, interaktive Übungen, ein vereinfachtes Profil ohne Auth, XP, Streaks, Badges und ein Leaderboard.

Der Kurskatalog ist über Prisma/SQLite seedbar und umfasst:

- Beginner Python: 5 Lektionen, 20 Übungen
- Beginner HTML: 3 Lektionen, 12 Übungen
- Intermediate Programmierwerkstatt: 5 Lektionen, 20 Übungen
- Expert Tech-Lab: 3 Lektionen, 12 Übungen

Die Übungstypen sind:

- Multiple Choice mit direktem Feedback, Shake/Glow und Konfetti
- Code-Lücken mit CodeMirror
- Freie Code-Aufgaben mit CodeMirror
- Python-Ausführung über lazy-loaded Pyodide
- HTML/CSS/JavaScript-Preview in einem sandboxed iframe

## Wichtige Implementierungen

- `prisma/schema.prisma`: Datenmodell für User, Course, Lesson, Exercise, Progress und Badge
- `prisma/seed.ts`: idempotenter MVP-Seed mit 4 Kursen, 16 Lektionen und 64 Übungen
- `src/app/api/profile/*`: Profilanlage und Dashboard-Daten
- `src/app/api/progress/route.ts`: Antwortprüfung, Fortschritt, XP, Streaks und Badge-Vergabe
- `src/lib/gamification.ts`: zentrale Regeln für Badges, Streaks, Stats und Beginner-Level-Up
- `src/components/editor/code-editor.tsx`: CodeMirror-Integration
- `src/lib/pyodide-loader.ts`: lazy-loaded Python-Runtime
- `src/components/lessons/*`: Theorie- und Übungsoberflächen
- `src/app/leaderboard/page.tsx`: XP-Leaderboard

## Produktionslücken

- Es gibt bewusst keine Authentifizierung. Profile hängen aktuell an `localStorage` und sind damit nur für lokale Demo-/MVP-Nutzung gedacht.
- Freie Code-Aufgaben werden pragmatisch über erwartete Ausgabe oder Code-Substring validiert. Für Produktion braucht es robuste Tests pro Aufgabe.
- Pyodide wird clientseitig geladen und ist groß. Für schwache Geräte sollte Caching, Preload-Strategie und Fallback-Verhalten genauer getestet werden.
- C-Inhalte sind im MVP Theorie- und Multiple-Choice-basiert. Eine echte C-Runtime ist nicht integriert.
- Es gibt keine Admin-Oberfläche für Content-Pflege. Inhalte werden über den Prisma-Seed verwaltet.
- Accessibility, Kinderschutz, Datenschutz, Elternfreigaben und Content-Review sind noch nicht produktionsreif abgeschlossen.
- E2E-Tests fehlen noch. Die aktuelle Verifikation besteht aus Typecheck, Lint, Build, Seed und Smoke-Requests.

## Betrieb

Lokaler Start:

```bash
npm install
npx prisma generate
npx prisma db push
npm run db:seed
npm run dev
```

Qualitätschecks:

```bash
npm run typecheck
npm run lint
npm run build
```

## Nächste sinnvolle Schritte

1. Authentifizierung und Eltern-/Lehrerrollen planen.
2. Produktionsdatenbank und Deployment-Pipeline einrichten.
3. Aufgabenvalidatoren pro Sprache und Übungstyp härten.
4. Automatisierte E2E-Flows für Profilanlage, Kursabschluss und Badge-Vergabe ergänzen.
5. Content redaktionell mit Kindern testen und altersgerecht nachschärfen.

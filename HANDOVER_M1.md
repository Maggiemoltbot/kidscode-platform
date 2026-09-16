# HANDOVER M1 — KidsCode Platform
Datum: 2026-09-16
Phase: M1 — Projektaufbau & Grundgeruest

## Was wurde gebaut
- `package.json`: Next.js-14-Projekt mit TypeScript, Tailwind, ESLint, shadcn/ui, Framer Motion, Prisma, CodeMirror und Hilfsskripten (`build`, `typecheck`, `lint`, `db:seed`).
- `prisma/schema.prisma`: SQLite-Schema mit `User`, `Course`, `Lesson`, `Exercise`, `Progress`, `Badge` sowie `Level`- und `ExerciseType`-Enums.
- `prisma/seed.ts`: Idempotenter Seed fuer 2 Beginner-Kurse, 6 Lektionen und 18 Uebungen.
- `src/lib/prisma.ts`: Gemeinsamer Prisma-Client mit SQLite-Driver-Adapter fuer Prisma 7.
- `src/components/layout/*`: Header, Footer, ThemeProvider und Dark/Light-Toggle.
- `src/components/ui/button.tsx` und `src/lib/utils.ts`: shadcn/ui-Basisbutton und `cn`-Utility.
- `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/globals.css`: Globales Layout, M1-Startseite und KidsCode Theme-Tokens.
- `.gitignore`, `components.json`, `postcss.config.mjs`, `next.config.mjs`, `tsconfig.json`: Projektkonfiguration fuer Next.js 14, Tailwind 4 und lokale SQLite-Datei.

## Getroffene Entscheidungen
- `create-next-app` konnte den nicht-leeren Projektordner nicht direkt ueberschreiben. Ich habe das Template in einem temporaeren Ordner erzeugt und danach ins Repo synchronisiert, damit bestehende Projektdateien erhalten bleiben.
- Das aktuelle `create-next-app` erzeugte Next 16. Ich habe auf Next.js 14.2.35 gepinnt, weil das Projekt-AGENTS.md Next.js 14 vorgibt.
- Prisma 7 benoetigt fuer SQLite einen Driver-Adapter. Deshalb nutzt `src/lib/prisma.ts` `@prisma/adapter-better-sqlite3`, statt Prisma zu downgraden.
- Die lokale SQLite-Datei liegt als `dev.db` im Projektwurzel und ist per `.gitignore` ausgeschlossen.
- Seed-Daten verwenden stabile IDs und `upsert`, damit mehrfaches Seeden keine Dubletten erzeugt.

## Qualitäts-Gates
- [x] npm run build → 0 errors
- [x] npm run typecheck → 0 errors
- [x] npm run lint → 0 errors

## Smoke-Test
- `npx prisma validate` → Schema valide.
- `npx prisma generate` → Prisma Client generiert.
- `npx prisma db push` → SQLite-Schema erfolgreich synchronisiert.
- `npm run db:seed` → Seed laeuft erfolgreich.
- SQLite-Check: 2 Kurse, 6 Lektionen, 18 Uebungen vorhanden.

## Nächste Phase: M2
Landing Page mit animiertem Maskottchen, Level-Auswahl und `/courses/[level]`-Kursuebersicht aus den Seed-Daten bauen.

## Offene Punkte
- `npm audit` meldet aktuell 9 Findings aus installierten Dependencies. Keine Build-Blockade; spaeter gezielt bewerten, bevor Breaking-Fixes angewendet werden.

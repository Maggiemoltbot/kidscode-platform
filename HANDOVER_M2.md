# HANDOVER M2 — KidsCode Platform
Datum: 2026-09-16
Phase: M2 — Startseite & Level-Auswahl

## Was wurde gebaut
- `src/app/page.tsx`: Server-Seite, die Level-Statistiken aus Prisma laedt und an die animierte Landing Page uebergibt.
- `src/components/home/landing-page.tsx`: Hero mit Titel `KidsCode`, Untertitel, CTA `Jetzt starten!` und animierten Level-Cards.
- `src/components/mascot/robot-mascot.tsx`: SVG-Roboter mit Framer-Motion-Idle-Animation.
- `src/app/courses/[level]/page.tsx`: Dynamische Level-Route fuer Beginner, Intermediate und Expert.
- `src/components/courses/course-level-view.tsx`: Kurs- und Lektionsuebersicht mit Fortschritts-Badge und animierten Cards.
- `src/lib/level-config.ts`: Zentrale Level-Konfiguration fuer Slugs, Labels, DB-Level und UI-Akzente.
- `src/lib/course-queries.ts`: Server-seitige Prisma-Abfragen fuer Level-Statistiken und Kursuebersichten.
- `src/app/globals.css`: Theme-Tokens auf Purple `#7C3AED` und Orange `#F97316` ausgerichtet.

## Getroffene Entscheidungen
- Die Startseite liest echte Kurszahlen aus der DB, damit die Level-Cards nicht hart verdrahtet sind.
- Intermediate und Expert zeigen aktuell leere Zustandskarten, weil M1 nur Beginner-Seed-Daten verlangt. Vollstaendige Inhalte folgen in M8.
- `/courses/[level]` ist bewusst dynamisch, damit Next beim Build keinen nativen SQLite-Treiber prerendern muss und die Daten zur Laufzeit aus SQLite kommen.
- `better-sqlite3` und Prisma-Adapter sind in `next.config.mjs` als Server-External-Packages konfiguriert, damit native Bindings nicht in das Next-Server-Bundle gezogen werden.

## Qualitäts-Gates
- [x] npm run build → 0 errors
- [x] npm run typecheck → 0 errors
- [x] npm run lint → 0 errors

## Smoke-Test
- `/` rendert als dynamische Startseite mit Level-Daten aus SQLite.
- `/courses/beginner` wird als dynamische Route gebaut und kann zur Laufzeit die 2 Beginner-Kurse mit 6 Lektionen anzeigen.
- `/courses/intermediate` und `/courses/expert` haben einen leeren Zustand, ohne zu crashen.

## Nächste Phase: M3
Profil-Erstellung mit `POST /api/profile`, `localStorage`-Persistenz und Profil-Dashboard mit XP, Streak, Badges und Kursfortschritt bauen.

## Offene Punkte
- Fortschritt ist in M2 nur als Platzhalter `0 / n erledigt` sichtbar. Echte Progress-Daten werden in M3/M5 angebunden.

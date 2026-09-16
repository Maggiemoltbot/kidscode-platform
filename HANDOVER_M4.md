# HANDOVER M4 — KidsCode Platform
Datum: 2026-09-16
Phase: M4 — Lektions-Screen & Theorie

## Was wurde gebaut
- `src/lib/lesson-queries.ts`: Server-Queries fuer Lesson-Detaildaten und Exercise-Preview inklusive Level-Validierung.
- `src/app/courses/[level]/[lessonId]/page.tsx`: Dynamische Lektionsroute mit Metadata und `notFound()` fuer ungueltige Slugs/IDs.
- `src/components/lessons/lesson-theory-view.tsx`: Lektionsscreen mit Breadcrumb, Level-Badge, Fortschrittsbalken, Theorieblock, Code-Snippet und Robotersprechblase.
- `src/app/courses/[level]/[lessonId]/exercise/[exerciseId]/page.tsx`: Stabile Zielroute fuer den Button "Zur Uebung!".
- `src/components/lessons/exercise-preview.tsx`: Minimaler Exercise-Shell, der Frage, Typ, XP und Tipp zeigt, bis M5 die echte Interaktion ergaenzt.

## Getroffene Entscheidungen
- Die Lektionsseite bleibt serverseitig gerendert, weil alle Inhalte aus Prisma kommen und keine Browser-only-Daten benoetigt werden.
- Der Button "Zur Uebung!" verlinkt bereits auf eine echte Exercise-Route. Die Seite zeigt in M4 bewusst nur einen Preview-Zustand, damit keine tote Navigation entsteht und M5 darauf aufbauen kann.
- Da `Exercise` noch kein eigenes `order`-Feld besitzt, werden Uebungen didaktisch nach `MULTIPLE_CHOICE`, `CODE_GAP`, `FREE_CODE` und danach nach ID sortiert.
- Codebeispiele werden aus einer kleinen Lesson-ID-Map geliefert; das haelt M4 schlank und kann in M8 mit erweiterten Kursinhalten sauber ersetzt werden.

## Qualitäts-Gates
- [x] npm run build → 0 errors
- [x] npm run typecheck → 0 errors
- [x] npm run lint → 0 errors

## Smoke-Test
- `GET /courses/beginner/lesson-python-hallo-welt` ueber lokalen Dev-Server → HTTP 200, Lektionsinhalt sichtbar.
- `GET /courses/beginner/lesson-python-hallo-welt/exercise/exercise-python-hallo-mc-1` ueber lokalen Dev-Server → HTTP 200, Exercise-Shell sichtbar.

## Nächste Phase: M5
Erster Schritt: Die vorbereitete Exercise-Route in einen interaktiven Multiple-Choice-Flow umbauen und `POST /api/progress` fuer Completion, XP und Badge-Vergabe ergaenzen.

## Offene Punkte
- Der Fortschrittsbalken zeigt in M4 nur den Einstieg in die Lektion; echte Completion-Daten werden ab M5 geschrieben.
- Der Exercise-Shell ist noch nicht bewertend, sondern nur eine stabile Zwischenroute fuer M5.

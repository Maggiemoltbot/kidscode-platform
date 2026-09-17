# M10B — Grafische Konzept-Erklärungen

Stand: 17.09.2026

## Gebaut und entschieden

- `src/components/lessons/concept-visual.tsx`: vier interaktive SVG-Diagramme mit Framer Motion, reduzierter Bewegung, zugänglicher Beschreibung und textlicher Ausgabe. Namen ändern Eingabe, Verzweigung und Ausgabe; Schleifen lassen sich schrittweise ausführen und zurücksetzen. UI auf DE/EN/FR.
- `src/components/lessons/lesson-theory-view.tsx`: optionaler „Konzept zeigen 🔍“-Toggle. Andere Lektionen bleiben unverändert.
- `src/lib/concepts.ts`, `src/lib/lesson-queries.ts`: geprüfte Konzepttypen und Übergabe an die Ansicht.
- `prisma/schema.prisma`, `prisma/seed.ts`: optionales `Lesson.conceptType`; Variablen, if/else, Schleifen und Funktionen zugeordnet.
- `prisma/migrations/`: M9-Baseline plus additive Konzept-Spalte. Keine neue Visualisierungsbibliothek.

Diagramme passen zu den existierenden Beispielen (u. a. `range(4)` und Raketen, `begruessen("Byte")`). Die Funktion zeigt eine Bildschirmausgabe mit `print`, ausdrücklich keinen Rückgabewert von `return`.

## Migration und Prüfungen

Vorher Datenbanksicherung unter `/tmp/kidscode-m10-before-migration.db`. Das vorhandene Schema wurde per `prisma migrate diff` mit M9 abgeglichen (kein Unterschied), die Baseline als angewendet markiert, danach `prisma migrate deploy`, `prisma generate` und `npm run db:seed` ausgeführt. 3 Profile, 28 Fortschrittseinträge, 16 Lektionen und 64 Übungen bleiben erhalten. SQL-Vergleich der Profile und Fortschritte in beide Richtungen: jeweils 0 Abweichungen.

Neue leere Testdatenbank `/tmp/kidscode-m10-migration-check.db`: beide Migrationen erfolgreich. Schema-Diff nach Migration: kein Unterschied.

- `npm run build`, `npm run typecheck`, `npm run lint`: erfolgreich.
- `npx tsx --test tests/concepts.test.ts`: erfolgreich.
- Browser-Smoke im M10-Abschluss: alle vier Diagramme öffnen, Eingaben ändern, beide if-Zweige, Schleife durchlaufen/zurücksetzen, schmale Ansicht prüfen.

Für weitere vorhandene M9-Datenbanken nach Schema-Abgleich einmalig `npx prisma migrate resolve --applied 20260917090000_m9_baseline`, anschließend `npx prisma migrate deploy`. Für leere Datenbanken genügt `migrate deploy`.

## Nächster Schritt

M10C: kommentierte Seed-Beispiele, Toggle in Theorie und Editor sowie Erklärungsblock beim ersten Einblenden. Endgültiger Neustart von Port 3001 erst nach Abschluss.

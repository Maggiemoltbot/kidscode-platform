# M9A — Umlaute

Datum: 17.09.2026

## Bereits vorhandene Vorarbeit
Der vorherige M9A-Stand hatte sichtbare ASCII-Umlaute in Seed, UI und API korrigiert, UTF-8 im Layout ergänzt und SF Pro/SF Mono als Systemfont-Stack eingerichtet. Technische Bezeichner wie `begruessen()` blieben absichtlich unverändert. Diese Änderungen bleiben erhalten; dieser Durchlauf ergänzt die verbliebene Theorieüberschrift.

## Ergebnis und Entscheidung
- `src/components/lessons/lesson-theory-view.tsx`: „Kurz erklaert“ zu „Kurz erklärt“ korrigiert.
- `src/app/layout.tsx` besitzt bereits UTF-8 und `lang="de"`; `src/app/globals.css` nutzt bereits den SF-Systemfont-Stack. Kein Google-Font-Download notwendig.
- `prisma/seed.ts` enthält bereits echte Umlaute. Bewusst keine globale Ersetzung von `ss`, `ue` etc.: Sie würde Wörter und Python-Bezeichner wie `begruessen` beschädigen.

## Prüfungen
- Seed erneut ausgeführt: erfolgreich, bestehende IDs bleiben erhalten.
- Build, Typecheck, ESLint: jeweils Exit 0.
- Quelltext-Smoke: Theorieüberschrift und deutsche Seed-Texte geprüft.
- Visuelle Browserprüfung steht noch aus.

## Nächster Schritt
M9B: Apple-Oberfläche; Build-Ausgabe vom parallelen Dev-Server trennen.

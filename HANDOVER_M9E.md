# M9E – Zufällige Antworten, stabile Lösungswerte

Stand: 17.09.2026

## Gebaut und entschieden

- `src/lib/shuffle.ts`: unverändernder Fisher-Yates-Shuffle und Prüfung angebotener Antwortwerte.
- `src/components/lessons/exercise-preview.tsx`: einmaliges Mischen nach Hydrierung pro Übung/Optionssatz. Wiederholungsversuche, Sprachwechsel und normale Re-Renders behalten die Reihenfolge. Antworten werden in der angezeigten Reihenfolge vorgelesen.
- `prisma/seed.ts`: Optionen werden zusammen mit EN-/FR-Beschriftungen gemischt; die Lösung bleibt ihr ursprünglicher Wert, kein Index.
- `src/app/api/progress/route.ts`: nicht angebotene Antworten, Anzeigeindizes und übersetzte Labels werden vor dem Fortschritts-Update abgelehnt.
- `messages/{de,en,fr}.json`: zusätzliche API-Fehlermeldungen übersetzt.
- `tests/{shuffle,progress,tts-route}.test.ts`: Shuffle, echter Fortschritts-Handler und TTS-Fehlerfälle. Fortschrittstests verwenden eine eigene temporäre Datenbank ohne kopierte Nutzerprofile.

Zufälligkeit bedeutet keine erzwungene Abwechslung: Die richtige Antwort darf gelegentlich weiterhin zuerst stehen. Der Client mischt erst nach Hydrierung, damit Server- und Browser-HTML übereinstimmen. Seed-Zufall und Client-Zufall verändern keine bestehenden Lösungswerte oder Fortschrittszuordnungen.

## Verifiziert

- `npm run db:seed`: erfolgreich.
- `npm run build`, `npm run typecheck`, `npm run lint`: erfolgreich.
- `npx tsx --test tests/*.test.ts`: 11/11 erfolgreich, einschließlich falscher/richtiger/wiederholter Antwort und einmaliger XP-Vergabe.
- TTS-Route: ungültiges JSON, Sprache, fremder Origin, übergroßer Body und fehlender API-Schlüssel geprüft.
- `git diff --check`: erfolgreich.

## Manuelle Smoke-Test-Checkliste

- [ ] Dieselbe MC-Übung mehrfach neu öffnen: Positionen dürfen wechseln.
- [ ] Tipp öffnen, falsch antworten, erneut versuchen und Sprache wechseln: Reihenfolge bleibt innerhalb der Übung stabil.
- [ ] In DE/EN/FR richtige/falsche Antwort antippen; XP und Folgeschritt prüfen.
- [ ] Antwort-Vorlesen folgt der sichtbaren Reihenfolge.

Diese interaktiven Browserprüfungen sind nicht als durchgeführt markiert. Die API-Logik ist automatisiert geprüft; Darstellung und Audiotiming benötigen noch eine manuelle Sicht-/Hörprobe.

## Nächster Schritt

M9-Abschluss: letzte Qualitäts-Gates, kontrollierter Neustart von Port 3001, HTTP-Smoke-Test, Push nach `main` und Telegram. Danach M10 nach neuer Priorisierung; bestehende Code-Antwortvalidierung und Demo-Profilauthentifizierung wurden nicht umgebaut.

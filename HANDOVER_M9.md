# M9 – Abschluss und Übergabe

Stand: 17.09.2026

## Ergebnis und geänderte Bereiche

M9A–M9E sind implementiert; Details stehen in `HANDOVER_M9A.md` bis `HANDOVER_M9E.md`.

- Umlaute: echte UTF-8-Texte, HTML-Zeichensatz, Systemschrift ohne eingeschränkten Font-Download.
- Apple-Oberflächen: `src/app/globals.css`, Layout, gemeinsame Buttons und Ansichten unter `src/components/`; SF-Systemstack, Glas-Header, Karten, Dark Mode, Bewegung und einheitliche blaue Fortschrittsbalken. Tastaturfokus bleibt sichtbar.
- Audio: `src/app/api/tts/route.ts`, `src/components/tts/`, `src/lib/tts.ts`; ElevenLabs, 0,8×, Play/Pause, Wortmarkierung, optionale Antwort-Lesung und zufällige Rückmeldungen. Übungen versuchen ohne gespeicherte Präferenz automatisch vorzulesen; Theorie bleibt optional.
- Sprachen: `messages/{de,en,fr}.json`, `src/components/i18n/language-provider.tsx`, `src/lib/localization.ts`, öffentliche Abfragen/API sowie `prisma/{schema.prisma,seed.ts,translations.ts}`. Vollständig: 4 Kurse, 16 Lektionen, 64 Übungen mit EN-/FR-Texten.
- Antwortreihenfolge: `src/lib/shuffle.ts`, Seed, Übungsansicht und Fortschritts-API. Sprachbeschriftungen bleiben mit kanonischen Lösungswerten verbunden.
- Build-Isolation: `next.config.mjs`, `package.json`, `.gitignore`, `tsconfig.json`; Produktionsbuild in `.next-build`, laufender Dev-Server in `.next`.
- Prüfungen: `tests/*.test.ts`; keine weiteren Test-Abhängigkeiten erforderlich.

## Qualitäts-Gates und Laufzeit

- `npm run build`: Exit 0.
- `npm run typecheck`: Exit 0.
- `npm run lint`: Exit 0.
- `npx tsx --test tests/*.test.ts`: 11/11 erfolgreich.
- `git diff --check`: erfolgreich.
- Prisma-Schema übertragen, Client generiert, Seed erfolgreich ausgeführt; keine bestehenden Profile oder Fortschritte gelöscht.
- Server bis zum Abschluss-Build nicht gestoppt; anschließend kontrolliert mit SIGTERM auf Port 3001 neu gestartet. Log: `/tmp/kidscode-m9-dev.log`.
- HTTP-Smoke: Startseite, drei Kurslevel, Profil, Profilanlage, Rangliste, Theorie und Übung jeweils HTTP 200.
- TTS am laufenden Server: DE/EN/FR jeweils HTTP 200, Audio und 6/5/4 Wortzeiten für kurze Testtexte. Cache-Wiederverwendung bereits in M9C verifiziert.
- Bestehender Cloudflare-Prozess für `localhost:3001` bleibt bestehen; sein lokaler Readiness-Endpunkt meldet HTTP 200 und eine aktive Verbindung. Öffentliche Tunnel-URL nicht separat abgerufen.
- Keine `.env`-Datei, API-Schlüssel, lokale Datenbank oder Build-Artefakte versioniert.

Logs der abschließenden Gates liegen unter `/tmp/kidscode-m9-final-{build,typecheck,lint,tests}.log`.

## Offene manuelle Smoke-Checkliste / Limitierungen

- [ ] Responsive Sichtprüfung, Dark Mode und Tastaturnavigation im Browser.
- [ ] DE/EN/FR umschalten, Reload, Antwortwahl und stabile Reihenfolge innerhalb einer Übung.
- [ ] Vorlesen einmal per Klick freigeben; Play/Pause, Karaoke-Synchronität, Folgescreen und Feedback anhören.
- [ ] Offline-/API-Ausfall visuell prüfen: lesbarer Text und Bedienung bleiben erhalten.

Diese Browser-/Hörprüfungen wurden nicht durchgeführt. HTTP-Rendering und API-Verhalten sind geprüft, ersetzen aber keine visuelle Abnahme. Browser können Autoplay bis zum ersten Klick blockieren; dies wird erklärt und kann per Vorlesen-Button freigegeben werden.

Übersetzungen sind MVP-Texte ohne professionelles Lektorat. Code, Bezeichner und erwartete Programmausgaben bleiben absichtlich unverändert. SSR/Metadaten beginnen auf Deutsch; die gespeicherte Sprache wird nach Hydrierung angewendet.

TTS-Limit gilt pro Serverprozess, nicht verteilt oder pro Nutzer. Für öffentlichen Mehrinstanzbetrieb sind Authentifizierung/zentrale Verbrauchslimits ein Folgethema. Cache-Dateien werden nach sieben Tagen erneuert, jedoch nicht periodisch bereinigt. Bestehende Demo-Profilauthentifizierung und Code-Antwortvalidierung sind nicht Bestandteil dieses Umbaus.

## Nächster konkreter Schritt

M10: zuerst die obige visuelle und akustische Abnahme mit Rudi durchführen; anschließend nach seiner Priorisierung weiterarbeiten. Veröffentlichung erfolgt durch Push der Phasen- und Abschluss-Commits nach `main`; Telegram meldet den tatsächlich verifizierten Stand.

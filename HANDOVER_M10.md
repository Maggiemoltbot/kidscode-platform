# M10 — Abschluss

Stand: 17.09.2026

## Ergebnis und Dateien

M10A–C sind implementiert. Die vollständigen Dateilisten, Entscheidungen und Smoke-Checklisten stehen in:

- [HANDOVER_M10A.md](HANDOVER_M10A.md): Stimmenauswahl, Standardtempo 1,0×, gespeicherter Slider 0,7–1,5×, Sprach-Tags und tempoabhängiger Cache. Commit `58160ff`.
- [HANDOVER_M10B.md](HANDOVER_M10B.md): interaktive SVG-Konzeptgrafiken für Variablen, Entscheidungen, Schleifen und Funktionen; additive Prisma-Migration. Commit `826b54c`.
- [HANDOVER_M10C.md](HANDOVER_M10C.md): kommentierte Vorlagen für 16 Lektionen und 22 Code-Aufgaben, Kommentar-Toggle und einmalige Erklärung; CodeMirror-Dekorationen erhalten Eingaben und Undo. Commit `cc08020`.

Keine neue Projektabhängigkeit. Benutzer und Lernfortschritte blieben bei Migration und Seed unverändert. Secrets, Datenbanken, Cache und Build-Artefakte sind nicht Teil der Commits.

## Abschließende Verifikation

- `npm run build`: erfolgreich.
- `npm run typecheck`: erfolgreich, nach dem Dev-Neustart nochmals geprüft.
- `npm run lint`: erfolgreich.
- `npx tsx --test tests/*.test.ts`: 21 bestanden, 0 fehlgeschlagen.
- `git diff --check`: erfolgreich.
- Vollständige Browser-Smokes zunächst am Produktionsbuild auf Port 3002, anschließend erneut auf Dev-Port 3001: alle bestanden. TTS-Einstellungen und Wiedergabe, Kommentare, Editor-Eingaben/Undo, vier Konzepte, HTML/CSS, Sprachwechsel und mobile Darstellung geprüft; keine Browser-Laufzeitfehler.
- Dev-Server während der Entwicklung nicht beendet, erst zum Abschluss regulär neu gestartet. `http://localhost:3001` liefert HTTP 200. Temporären Produktionsserver auf Port 3002 beendet.
- Echter Aufruf von `/api/tts` auf Port 3001 mit Jessica, Deutsch, Tempo 1,0 und den Keywords `if`/`print`: HTTP 200, 74.022 Audio-Bytes, 12 Wortzeiten, Wiedergabefaktor 1.

Logs und Screenshots: `/tmp/kidscode-m10-*`. Browser-Smokes nutzen für wiederholte Wiedergaben eine echte MP3-Testdatei statt weiterer kostenpflichtiger API-Aufrufe. Der abschließende API-Test lief separat ohne Mock.

## Offene Punkte und nächster Schritt

Jessica ist die vorläufige Standardstimme nach Rudis Vorgabe; alle drei Stimmen lieferten gültige Audiodateien. Eine akustische Bewertung und der tatsächliche englische Sprachwechsel innerhalb deutscher Sätze sind nicht bestätigt. Die Sprach-Tags werden gesendet, ihre Annahme durch die API ersetzt keine Hörprobe. Oberhalb 1,2× ergänzt der Browser das Synthesetempo; Details in M10A.

Lernnotizen erläutern die Ausgangsvorlagen, nicht automatisch neuen eigenen Code. Selbst geschriebene Kommentare bleiben editierbar und sichtbar. Lernnotizen sind deutsch, Bedienelemente und Erklärung unterstützen DE/EN/FR.

Nach diesem Abschluss-Commit: `main` pushen und die beauftragte Telegram-Nachricht senden; deren Ergebnis wird in der finalen Rückmeldung bestätigt. Für M11 liegt noch kein Auftrag vor. Nächster fachlicher Abnahmeschritt ist Rudis Hörprobe mit den drei auswählbaren Stimmen.

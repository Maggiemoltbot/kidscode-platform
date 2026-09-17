# M10A — Stimme, Tempo und Sprach-Tags

Stand: 17.09.2026

## Gebaut

- `src/components/tts/tts-player.tsx`: Standard 1,0×, beschrifteter Slider 0,7–1,5×, gespeichertes Tempo und Stimmenauswahl (Jessica, Laura, Charlotte). Einstellungen synchronisieren mehrere Player; Änderungen stoppen alte Wiedergabe/Requests. Pause und Wortzeiten berücksichtigen das tatsächliche Wiedergabetempo.
- `src/lib/tts-settings.ts`: geprüfte Stimmen-Whitelist und Tempo-Grenzen. Jessica ist Standard.
- `src/app/api/tts/route.ts`: Multilingual v2, Stimme/Tempo im Cache-Key, Synthesetempo in `voice_settings.speed`, bestehende Schutzmechanismen bleiben erhalten.
- `src/lib/tts-preprocessor.ts`: englische Keyword-/Backtick-Tags für DE/FR, ein Durchlauf ohne verschachtelte Tags, XML-Escaping. EN bleibt unverändert.
- `src/lib/tts.ts`: SSML aus Wortausrichtung entfernen; bei nicht eindeutig zuordenbaren Texten weiterhin kein falsches Highlight.
- `src/app/globals.css`: lila Slider für Chromium/Safari/Firefox.

## Entscheidungen und API-Nachweis

Alle drei empfohlenen Voice-IDs lieferten HTTP 200 und gültige MP3s (Jessica 54.378, Laura 61.066, Charlotte 58.140 Bytes). Dateien: `/tmp/kidscode-m10-voice-<Voice-ID>.mp3`. Jessica wurde anhand der Vorgabe gewählt, nicht aufgrund einer behaupteten Hörprobe. Die UI erlaubt Rudis endgültige Auswahl.

ElevenLabs dokumentiert Synthesetempo 0,7–1,2. Oberhalb 1,2 erzeugt die API mit 1,2; der Browser ergänzt maximal Faktor 1,25. Dadurch bleibt der komplette gewünschte Slider nutzbar, ohne ungültige API-Werte. Browser-Beschleunigung kann die Tonhöhe verändern.

Der echte `/with-timestamps`-Test mit `Mit <lang xml:lang="en-US">if</lang> prüfst du eine Bedingung.` lieferte Audio und den normalisierten Text `Mit if prüfst du eine Bedingung.` Die Tags werden also verarbeitet und nicht als Markup im normalisierten Sprechtext ausgegeben. Ein garantierter Sprachwechsel durch `<lang>` ist in der offiziellen Dokumentation nicht zugesichert und ohne Hörprobe nicht bestätigt. Quellenprüfung: ElevenLabs „Best practices“, „Text to speech“ und „Convert with timestamps“ via DeepAPI.

## Prüfungen / Smoke-Checkliste

- `npm run build`: erfolgreich, isoliertes `.next-build`; Port 3001 unverändert.
- `npm run lint`: erfolgreich.
- `npx tsx --test tests/tts*.test.ts`: erfolgreich (Requestvalidierung, Cache, Tempo, Tags, Wortzeiten).
- `npm run typecheck`: erfolgreich.
- Abschluss-Smoke: Slider/Voice wechseln, neu laden, Pause/Fortsetzen; siehe abschließenden M10-Handover.
- Noch manuell zu hören: Natürlichkeit aller drei Stimmen und englische Aussprache im deutschen Satz.

## Nächster Schritt

M10B: additive Prisma-Migration und interaktive SVG-Konzeptgrafiken. Anschließend M10C: kommentierte Beispiele ohne Verlust eigener Editoränderungen.

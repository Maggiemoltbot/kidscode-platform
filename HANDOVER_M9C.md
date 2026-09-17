# M9C – Vorlesen mit Karaoke

## Gebaut
- `src/app/api/tts/route.ts`: ElevenLabs mit Original-Zeichenzeiten, Sprachwahl, begrenzten Requests, 20-s-Timeout, zusammengefassten parallelen Requests und Dateicache unter `/tmp/tts-cache/` (7 Tage Wiederverwendung).
- `src/lib/tts.ts`: Wortzeiten, Sprachtypen, jeweils vier positive/ermutigende Rückmeldungen.
- `src/components/tts/`: Web-Audio-Player mit 0,8×, Pause/Fortsetzen, Wortmarkierung, lokaler Autoplay-/Antworten-Einstellung; Integration in Theorie und Übungen.
- `.env.local`: Key ausschließlich serverseitig, geschützt und nicht versioniert.

## Entscheidungen
Eine gemeinsame AudioContext-Instanz verhindert paralleles Vorlesen. Ohne erste Benutzerinteraktion blockieren Browser Autoplay: der Play-Button bleibt verfügbar. Ohne gespeicherte Präferenz startet die Theorie ohne Autoplay, Übungen versuchen automatisch vorzulesen. Eine explizite Nutzerwahl gilt für beide Ansichten. Unpassende normalisierte Zeitstempel werden nicht irreführend markiert. Programmcode wird als Text behandelt.

## Verifiziert
Build, Typecheck, Lint erfolgreich. Drei Unit-Tests erfolgreich. Echter ElevenLabs-Test in DE/EN/FR: jeweils HTTP 200, Audio und Wortzeiten vorhanden. Zweiter identischer Request jeweils Cache-Hit in 1–2 ms. Keine Schlüssel protokolliert.

## Offen / nächster Schritt
M9D verbindet Spracheinstellungen mit UI und Datenbankübersetzungen. Manuelle Checkliste: Play/Pause/Fortsetzen, Karaoke, Sprachwechsel während Audio, abgelehntes Autoplay und Offline-Modus. Hörprobe und Browser-Timing sind noch nicht manuell verifiziert. Rate-Limit ist pro Serverprozess; für öffentlichen Mehrinstanzbetrieb wären zentrale Limits/Authentifizierung nötig. Abgelaufene Cache-Dateien werden überschrieben, nicht periodisch bereinigt.

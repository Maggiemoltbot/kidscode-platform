# HANDOVER M9A — Umlaut-Encoding

## Was wurde gebaut
- `prisma/seed.ts`: sichtbare deutsche ASCII-Umlautschreibungen (`ue/ae/oe`) in echte UTF-8-Zeichen umgestellt.
- `src/app/layout.tsx`: explizites `<meta charSet="utf-8" />` ergänzt, `<html lang="de">` bleibt gesetzt.
- `src/app/globals.css`: Basisfont auf Apple-Systemfont-Stack inklusive SF Pro/SF Mono umgestellt.
- Sichtbare UI- und API-Texte in `src/` mit falschen Umlaut-Schreibweisen korrigiert.

## Entscheidungen
- Technische Code-Identifier wie `begruessen()` bleiben ASCII, weil sie Teil von ausführbarem Beispielcode sind.
- Nutzerseitig sichtbarer Inhalt verwendet echte Umlaute, damit Seed-Daten und UI konsistent gerendert werden.

## Nächster Schritt
- M9B: Apple Design System mit iOS-Farben, Cards, Header, Buttons, Progress und Animationen.

## Smoke-Test-Checkliste
- `npm run db:seed` erfolgreich.
- `npm run build` erfolgreich, 0 Errors.
- Suchlauf nach offensichtlichen `AE/OE/UE`-Transliterationen in `src/` und `prisma/seed.ts` ohne Treffer.

## Offene Punkte / TODOs
- Vollständige i18n-Übersetzungen folgen in M9D.

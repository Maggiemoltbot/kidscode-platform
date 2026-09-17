# M9B – Apple Design

## Gebaut
- `src/app/globals.css`: Apple-Farben, SF-Systemschriften, Radien, helle/dunkle Oberflächen und reduzierte Bewegung.
- `src/components/`: Glas-Header/Sprechblase, randlose Karten, abgerundete Buttons, dezente Animationen; MC-Zustände und 20 Konfettipartikel.
- `next.config.mjs`, `package.json`, `.gitignore`: Produktionsbuild unter `.next-build`, damit der laufende Entwicklungsserver seine eigene Ausgabe behält.

## Entscheidungen
Tailwind 4 verwendet CSS-Theme-Tokens statt einer zusätzlichen Tailwind-3-Konfiguration. Systemschriften benötigen keinen Google-Download. Tastatur-Fokusringe bleiben aus Gründen der Bedienbarkeit erhalten; Dunkelmodus nutzt das bestehende next-themes.

## Prüfung und nächster Schritt
Build, Typecheck und Lint: alle erfolgreich (Exit 0). Manuelle Smoke-Checkliste: Startseite, Kurskarten, Theorie, richtige/falsche Antwort, Tastaturfokus, Dunkelmodus und reduzierte Bewegung. Visuelle Browserprüfung steht noch aus. M9C ergänzt Vorlesen und Karaoke.

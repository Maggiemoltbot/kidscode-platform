# M10C — Code-Kommentare und Abschlussprüfung

Stand: 17.09.2026

## Gebaut

- `src/lib/lesson-code.ts`: bisherige 16 Theoriebeispiele und Übungs-Vorlagen aus `lesson-queries.ts` zentralisiert, ohne die ausführbaren Zeilen zu ändern.
- `src/lib/code-comments.ts`: zeilenweise deutsche Lernnotizen mit `##COMMENT##`, sichere Trennung von Notizen und Code, Darstellung als Python-, HTML-, CSS-/JavaScript- oder C-Kommentare.
- `prisma/schema.prisma`, `prisma/migrations/20260917092000_m10_comments/migration.sql`, `prisma/seed.ts`: optionale Felder `Lesson.sampleCode` und `Exercise.starterCode`; Seed speichert annotierte Beispiele für alle 16 Lektionen und 22 Code-Aufgaben. Multiple-Choice-Aufgaben brauchen keine Editor-Vorlage.
- `src/lib/lesson-queries.ts`: liefert gespeicherten Beispielcode, mit passender Vorlage als Fallback.
- `src/components/editor/comment-toggle.tsx`: gemeinsamer Toggle, Erklärung beim ersten Einschalten, localStorage `kidscode-comment-explanation-seen`, animierte Einblendung; Bedienelemente auf DE/EN/FR.
- `src/lib/editor-comments.ts`, `src/components/editor/code-editor.tsx`: nicht editierbare Lernnotizen als CodeMirror-Dekorationen, Positionen folgen Änderungen. Umschalten ändert weder Dokument noch Undo-Verlauf.
- `src/components/lessons/exercise-preview.tsx`: Editor und Ausführung bekommen ausschließlich bereinigten Code. `lesson-theory-view.tsx`: kommentierte/unkommentierte Darstellung; mobile Mindestbreite korrigiert, damit lange Kommentare nur im Codeblock scrollen.
- `tests/code-comments.test.ts`, `tests/seed-comments.test.ts`: Parser, Syntax, Lücken, Dokument-/Undo-Erhalt und vollständige Seed-Abdeckung.

## Entscheidungen

Keine neue Abhängigkeit: vorhandene CodeMirror-Pakete liefern Dekorationen und Zustandsfelder. Ein Ersetzen des Editorinhalts beim Umschalten würde eigene Eingaben und Undo gefährden; deshalb bleiben Lernnotizen außerhalb des ausführbaren Dokuments. Kopieren aus dem Editor kopiert den Code, nicht die Dekorationen. Selbst geschriebene Kommentare bleiben sichtbar und editierbar.

Lernnotizen erklären die Ausgangsvorlage, nicht automatisch beliebig umgeschriebenen Code. Wie die bisherigen Codebeispiele bleiben sie deutsch; Toggle und Erklärung unterstützen alle drei UI-Sprachen. Lücken werden durch die Notizen nicht gelöst.

Die Migration ist additiv. Vorhandene Benutzer und Fortschritte wurden nach Migration/Seed mit der Sicherung vor M10 verglichen: in beiden Richtungen keine Unterschiede. Die vollständige Migrationsfolge funktioniert auch auf einer leeren SQLite-Datenbank; Schema-Diff zur Live-Datenbank ist leer. Vorgehen für M9-Datenbanken ohne Migrationshistorie: siehe `HANDOVER_M10B.md`.

## Prüfungen

- `npm run build`: erfolgreich, Ausgabe nach `.next-build`, Dev-Port 3001 während der Entwicklung nicht beendet.
- `npm run typecheck`: erfolgreich.
- `npm run lint`: erfolgreich, keine Fehler.
- `npx tsx --test tests/*.test.ts`: 21 Tests bestanden, keine Fehler.
- Browserprüfung des Produktionsbuilds auf temporärem Port 3002: alle untenstehenden Checks bestanden. Bestehendes lokales Playwright mit Chrome, keine neue Projektabhängigkeit. Profilzustand nur im isolierten Browser, keine Profilanlage oder Übungsabgabe.
- TTS-Browserprüfung mit echter MP3-Testdatei und abgefangenem API-Request; die drei echten ElevenLabs-Stimmentests sind in `HANDOVER_M10A.md` dokumentiert.
- `git diff --check`: erfolgreich.

## Ausgeführte Smoke-Checkliste

- [x] TTS startet bei 1,0×; Slider erreicht 0,7 und 1,5; Tempo und Stimme überleben Reload.
- [x] Gewähltes Tempo/Stimme im Request, Pause/Fortsetzen, Einstellungswechsel stoppt Wiedergabe.
- [x] Theorie-Kommentare standardmäßig aus; Einschalten zeigt passende Kommentare und einmalige Erklärung.
- [x] Editor: Ein-/Ausblenden erhält eigenen Code und Undo; Erklärung bleibt nach dem ersten Anzeigen verborgen.
- [x] HTML/CSS-Notizen haben passende Syntax, keine Marker gelangen in die HTML-Vorschau.
- [x] Variable reagiert auf Namen; if/else zeigt beide Wege; Funktion reagiert auf Eingabe; Schleife zählt Durchläufe und lässt sich zurücksetzen.
- [x] DE/EN/FR-Bedienelemente wechseln korrekt.
- [x] 390-px-Mobilansicht ohne horizontalen Seitenüberlauf; Desktop/Mobil/Editor-Screenshots visuell geprüft.
- [x] Keine Browser-Laufzeitfehler im vollständigen Smoke-Lauf.

Prüflogs und Screenshots liegen unter `/tmp/kidscode-m10-*`; sie sind bewusst nicht versioniert. Lokales Browser-Skript: `/tmp/kidscode-m10-browser.cjs`.

## Nächster Schritt / offene Punkte

M10 abschließen: Dev-Server einmal regulär auf Port 3001 neu starten, dort final prüfen, Commits pushen und Telegram senden. Ergebnis im `HANDOVER_M10.md`.

M11 ist noch nicht beauftragt. Für die Abnahme bleiben die Hörprobe zur bevorzugten Stimme und die englische Aussprache innerhalb deutscher Sätze offen. `<lang>` wird übergeben, ein garantierter Sprachwechsel durch ElevenLabs ist nicht nachgewiesen. Details und Tempo-Fallback oberhalb 1,2× stehen in `HANDOVER_M10A.md`.

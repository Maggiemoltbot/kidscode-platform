# HANDOVER M5 — KidsCode Platform
Datum: 2026-09-16
Phase: M5 — Multiple-Choice, Feedback und Fortschritt

## Was wurde gebaut
- `src/app/api/progress/route.ts`: `POST /api/progress` validiert Multiple-Choice-Antworten, speichert Attempts/Completion, vergibt XP idempotent und erstellt den Badge "Erster Schritt" bei abgeschlossener Lektion.
- `src/lib/lesson-queries.ts`: Exercise-Daten um Optionen, Gesamtzahl und stabile Reihenfolge erweitert.
- `src/components/lessons/exercise-preview.tsx`: Exercise-Route zu einem interaktiven Runner ausgebaut mit 2x2-Antwortgrid, Sofortfeedback, rotem Shake, gruenem Glow, Konfetti-Burst, XP-Hinweis und Weiter-Logik.

## Getroffene Entscheidungen
- XP werden nur beim ersten korrekten Abschluss einer Exercise vergeben. Wiederholtes Absenden korrekt geloester Aufgaben erhoeht nur `attempts`, aber nicht die XP.
- Die Badge-Vergabe liegt serverseitig in der Progress-API, damit Dashboard und Uebungsflow denselben Datenstand nutzen.
- Der Lesson-Abschluss prueft alle Exercises der Lektion. Da Code-Luecken und Free-Code erst in M6 interaktiv werden, bleiben diese Typen in M5 sichtbar als vorbereiteter M6-Zustand.
- Die Antwortauswertung passiert serverseitig; der Client bekommt die richtige Antwort nur nach falscher Auswahl zur Lernhilfe.

## Qualitäts-Gates
- [x] npm run build → 0 errors
- [x] npm run typecheck → 0 errors
- [x] npm run lint → 0 errors

## Smoke-Test
- Lokaler Dev-Server: Profil fuer Smoke-Test erstellt.
- `POST /api/progress` mit falscher Antwort → HTTP 200, `correct=false`, `xpEarned=0`.
- `POST /api/progress` mit richtiger Antwort → HTTP 200, `correct=true`, `xpEarned=10`, Gesamt-XP 10.
- Dieselbe richtige Antwort erneut → HTTP 200, `alreadyCompleted=true`, `xpEarned=0`, keine Doppel-XP.
- Code-Gap-Fortschritt fuer den Smoke-Test direkt in `dev.db` markiert, danach zweite MC-Frage korrekt beantwortet → `lessonCompleted=true`, Badge "Erster Schritt" vergeben.
- `GET /api/profile/:userId` zeigt 20 XP und Badge "Erster Schritt"; temporaerer Smoke-User wurde geloescht.

## Nächste Phase: M6
Erster Schritt: Die vorbereiteten `CODE_GAP`- und `FREE_CODE`-Zustaende durch einen CodeMirror-basierten Editor ersetzen und Python/HTML-Ausfuehrung einbauen.

## Offene Punkte
- Vollstaendige Lesson-Abschluesse sind fuer echte Nutzer erst ab M6 ohne manuelle Hilfsdaten erreichbar, weil Code-Exercises dann interaktiv geloest werden koennen.
- Die M5-UI behandelt Multiple Choice komplett; Code-Typen zeigen noch den M6-Hinweis.

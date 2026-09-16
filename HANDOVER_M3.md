# HANDOVER M3 — KidsCode Platform
Datum: 2026-09-16
Phase: M3 — Benutzerprofil ohne Auth

## Was wurde gebaut
- `src/app/profile/new/page.tsx`: Profil-Erstellseite mit Nameingabe und sechs Emoji-Avataren.
- `src/components/profile/profile-create-form.tsx`: Client-Formular mit API-Submit, Fehlerzustand und Speicherung der `userId` im Browser.
- `src/app/profile/page.tsx`: Profil-Dashboard-Seite.
- `src/components/profile/profile-dashboard.tsx`: Dashboard mit Avatar, Name, XP, Streak, Badge-Grid und Kursfortschritt.
- `src/app/api/profile/route.ts`: `POST /api/profile` zum Erstellen eines lokalen Kinderprofils.
- `src/app/api/profile/[userId]/route.ts`: `GET /api/profile/:userId` für Dashboard-Daten inklusive Badges und Kursfortschritt.
- `src/lib/storage-keys.ts`: Gemeinsamer localStorage-Key für das Profil.

## Getroffene Entscheidungen
- Profilzustand bleibt bewusst simpel: Die DB hält die Nutzerdaten, der Browser speichert nur `kidscode:userId` in `localStorage`, weil M3 ausdrücklich ohne Login/Auth gebaut werden soll.
- `/profile` ist eine Client-Seite, weil die Redirect-Entscheidung vom Browser-Storage abhängt.
- Neue Profile starten mit `streak = 1` und `lastActiveAt = now`, damit Kinder direkt sichtbares Feedback bekommen; die vollständige Tageslogik folgt in M7.
- Kursfortschritt wird in M3 nur gelesen und visualisiert. Schreibende Progress-Updates kommen in M5 mit den Übungen.

## Qualitäts-Gates
- [x] npm run build → 0 errors
- [x] npm run typecheck → 0 errors
- [x] npm run lint → 0 errors

## Smoke-Test
- `POST /api/profile` über lokalen Dev-Server erstellt ein Testprofil erfolgreich mit HTTP 201.
- `GET /api/profile/:userId` lädt das erstellte Profil und zwei Kursfortschritts-Einträge erfolgreich mit HTTP 200.
- Temporärer Smoke-Test-User wurde anschließend aus `dev.db` entfernt.

## Nächste Phase: M4
Erster Schritt: Lesson-Query und Route `/courses/[level]/[lessonId]` anlegen, damit Theorie, Breadcrumb und Übungsfortschritt aus den bestehenden Seed-Lektionen geladen werden können.

## Offene Punkte
- Badge-Vergabe ist noch nicht aktiv; sie wird in M5/M7 an echte Abschlüsse gekoppelt.
- Fortschrittswerte bleiben bis M5 auf 0 %, weil noch keine Exercise-Completion geschrieben wird.

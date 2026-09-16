# HANDOVER M7 — KidsCode Platform
Datum: 2026-09-16
Phase: M7 — Gamification & Polish

## Was wurde gebaut
- `src/lib/gamification.ts`: Zentrale Streak-, Badge- und Level-Up-Regeln mit 10 Badge-Definitionen.
- `src/app/api/progress/route.ts`: Fortschritts-API vergibt XP, aktualisiert Streaks und erstellt alle neu erreichten Badges.
- `src/app/api/profile/[userId]/route.ts`: Dashboard-API berechnet sichtbare Streaks, Kurs-/Lektionsfortschritt, fehlende Badges und Beginner-Level-Up-Status.
- `src/components/profile/profile-dashboard.tsx`: XP-/Streak-Count-up, Level-Up-Hinweis, Skeleton-Loading und responsive Stat-Kacheln.
- `src/app/leaderboard/page.tsx`: Rangliste mit Top-10-Profilen nach XP.
- `src/components/courses/course-level-view.tsx`: Kurs- und Lektionskarten zeigen echten Profilfortschritt aus der Profil-API.
- `src/components/lessons/exercise-preview.tsx`: Abschluss-Screen kann mehrere gleichzeitig vergebene Badges anzeigen.
- `src/components/ui/skeleton.tsx` und `src/app/**/loading.tsx`: Skeleton-Komponenten fuer Startseite, Kurse, Lektionen, Uebungen, Profil und Rangliste.
- `src/components/layout/site-header.tsx`: Mobile Navigation fuer 360px-Displays verbessert.

## Getroffene Entscheidungen
- Gamification-Regeln liegen in `src/lib/gamification.ts`: API-Routen und Dashboard verwenden dieselbe Logik, damit Badge- und Level-Up-Zustand konsistent bleiben.
- GET `/api/profile/[userId]` erstellt fehlende Badges nachtraeglich: Bestehende Profile erhalten neue M7-Badges ohne Migration.
- Streak-Anzeige wird aus `lastActiveAt` abgeleitet: Nach mehr als einem Tag Pause wird sichtbar 0 gezeigt, die naechste Aktivitaet startet wieder bei 1.
- Level-Up wird ueber vollstaendig abgeschlossene Beginner-Uebungen berechnet: Das passt zur aktuellen vereinfachten Plattform ohne Auth und ohne getrennte Kursfreischaltung.

## Qualitäts-Gates
- [x] npm run build → 0 errors
- [x] npm run typecheck → 0 errors
- [x] npm run lint → 0 errors

## Smoke-Test
- Temporaeres Profil per `POST /api/profile` erstellt.
- `POST /api/progress` fuer `exercise-python-hallo-mc-1` mit korrekter Antwort getestet: XP, Streak-Aktivitaet und Badge `Python Starter` wurden vergeben.
- `GET /api/profile/<temp-user>` getestet: Kurs-/Lektionsfortschritt, Badge-Liste und `levelUp.beginnerComplete=false` korrekt.
- `GET /leaderboard` → HTTP 200.
- `GET /courses/beginner` → HTTP 200.
- Temporaeres Smoke-Profil anschliessend wieder geloescht.

## Nächste Phase: M8
Seed-Script anhand `KONZEPT.md` auf alle Beginner-, Intermediate- und Expert-Lektionen erweitern und danach README plus finalen MVP-Report schreiben.

## Offene Punkte
- Mobile UI wurde statisch und per HTTP-Smoke geprueft, aber noch nicht visuell im Browser mit Screenshot-Regression getestet.
- Die Rangliste ist bewusst ohne Auth und ohne Datenschutzfilter, passend zur vereinfachten MVP-Vorgabe.

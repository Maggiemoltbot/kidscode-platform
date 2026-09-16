# DEVPLAN — KidsCode Platform

Datum: 2026-09-16
Ziel: Autonomer Entwicklungsfahrplan fuer das KidsCode MVP in acht Meilensteinen.

## Produktziel

KidsCode wird eine spielerische Lernplattform fuer Kinder ab etwa 5 bis 6 Jahren. Der MVP verbindet kurze Theorie, Multiple Choice, Code-Lueckentexte, freie Code-Uebungen, Profil, Fortschritt, XP, Badges und ein freundlich animiertes Maskottchen. Das Produkt folgt dem Prinzip aus `KONZEPT.md`: konkrete sichtbare Ergebnisse zuerst, abstrakte Begriffe danach.

## Tech-Stack-Entscheidungen

- **Next.js 14 App Router mit TypeScript strict:** erfuellt die Projektvorgabe, bietet serverseitige Datenzugriffe, API Routes und komponentenbasierte UI ohne zusaetzlichen Backend-Service.
- **Tailwind CSS + shadcn/ui:** Tailwind liefert schnelle, konsistente Layouts; shadcn/ui liefert zugängliche Basis-Komponenten, die optisch an KidsCode angepasst werden koennen.
- **SQLite + Prisma:** SQLite ist fuer den MVP lokal, einfach reproduzierbar und ohne separaten Server lauffaehig. Prisma haelt Schema, Seed-Daten und Queries typsicher.
- **CodeMirror 6:** leichter und besser kontrollierbar als Monaco fuer kindgerechte Lernoberflaechen; Python, HTML und spaeter JavaScript lassen sich modular aktivieren.
- **Pyodide lazy-loaded:** Python laeuft im Browser ohne Server-Code-Ausfuehrung. Wegen Groesse und Ladezeit wird Pyodide nur geladen, wenn eine Python-Uebung geoeffnet oder ausgefuehrt wird.
- **Sandboxed iframe fuer HTML:** HTML-Lektionen rendern sicher und sofort sichtbar im Browser, ohne Code auf der Hauptseite auszufuehren.
- **Framer Motion:** deckt Karten-Animationen, Maskottchen-Idle, Feedback-Shakes, Konfetti-Partikel und XP-Transitions mit einer Bibliothek ab.
- **localStorage ohne Auth im MVP:** passend zur Aufgabenstellung und kindgerechtem Einstieg. Das Profil wird in der DB gespeichert, der Browser merkt sich nur `userId`.

## Datenbankschema

### Enums

- `Level`: `BEGINNER`, `INTERMEDIATE`, `EXPERT`
- `ExerciseType`: `MULTIPLE_CHOICE`, `CODE_GAP`, `FREE_CODE`

### User

- `id: String @id @default(cuid())`
- `username: String`
- `avatar: String`
- `createdAt: DateTime @default(now())`
- `xp: Int @default(0)`
- `streak: Int @default(0)`
- `lastActiveAt: DateTime?`
- Relationen: `progress Progress[]`, `badges Badge[]`

### Course

- `id: String @id @default(cuid())`
- `title: String`
- `level: Level`
- `description: String`
- `order: Int`
- Relationen: `lessons Lesson[]`
- Index: `@@index([level, order])`

### Lesson

- `id: String @id @default(cuid())`
- `courseId: String`
- `course: Course @relation(fields: [courseId], references: [id], onDelete: Cascade)`
- `title: String`
- `language: String`
- `theory: String`
- `order: Int`
- Relationen: `exercises Exercise[]`
- Index: `@@index([courseId, order])`

### Exercise

- `id: String @id @default(cuid())`
- `lessonId: String`
- `lesson: Lesson @relation(fields: [lessonId], references: [id], onDelete: Cascade)`
- `type: ExerciseType`
- `question: String`
- `options: Json?`
- `correctAnswer: String`
- `hint: String`
- `xpReward: Int @default(10)`
- Relationen: `progress Progress[]`
- Index: `@@index([lessonId])`

### Progress

- `id: String @id @default(cuid())`
- `userId: String`
- `user: User @relation(fields: [userId], references: [id], onDelete: Cascade)`
- `exerciseId: String`
- `exercise: Exercise @relation(fields: [exerciseId], references: [id], onDelete: Cascade)`
- `completed: Boolean @default(false)`
- `correct: Boolean @default(false)`
- `attempts: Int @default(0)`
- `completedAt: DateTime?`
- Unique: `@@unique([userId, exerciseId])`
- Index: `@@index([userId])`

### Badge

- `id: String @id @default(cuid())`
- `userId: String`
- `user: User @relation(fields: [userId], references: [id], onDelete: Cascade)`
- `name: String`
- `icon: String`
- `earnedAt: DateTime @default(now())`
- Unique: `@@unique([userId, name])`

## Komponentenstruktur

```text
src/
  app/
    layout.tsx
    page.tsx
    globals.css
    api/
      profile/route.ts
      progress/route.ts
      badges/route.ts
    courses/
      [level]/
        page.tsx
        [lessonId]/
          page.tsx
          exercises/
            [exerciseId]/page.tsx
    profile/
      page.tsx
      new/page.tsx
    leaderboard/page.tsx
  components/
    layout/
      site-header.tsx
      site-footer.tsx
      theme-toggle.tsx
    mascot/
      mascot.tsx
      mascot-bubble.tsx
    courses/
      level-card.tsx
      lesson-card.tsx
      course-progress.tsx
    profile/
      avatar-picker.tsx
      xp-counter.tsx
      badge-grid.tsx
      course-progress-list.tsx
    lessons/
      lesson-theory.tsx
      breadcrumb.tsx
      lesson-progress.tsx
    exercises/
      exercise-shell.tsx
      multiple-choice.tsx
      code-gap.tsx
      free-code.tsx
      code-editor.tsx
      pyodide-runner.tsx
      html-preview.tsx
      completion-screen.tsx
    ui/
      shadcn-komponenten
  lib/
    prisma.ts
    data/
      badges.ts
      levels.ts
    profile.ts
    progress.ts
    streak.ts
    exercises.ts
    pyodide.ts
  prisma/
    schema.prisma
    seed.ts
```

## Phasenplan M1-M8

### M1 — Projektaufbau & Grundgeruest

Deliverables:

- Next.js 14 Projekt im bestehenden Ordner, TypeScript, Tailwind, ESLint, App Router, `src/`.
- Dependencies: shadcn/ui-Basis, Framer Motion, Prisma, Prisma Client, CodeMirror Python/HTML.
- Prisma-Schema mit `User`, `Course`, `Lesson`, `Exercise`, `Progress`, `Badge`.
- SQLite DB via `prisma db push`.
- Idempotenter Seed mit zwei Beginner-Kursen, je drei Lektionen, je drei Exercises.
- Globales Layout mit Header, Logo, Navigation, Footer und Dark/Light Mode.
- `HANDOVER_M1.md`.

Komplexitaet: Mittel. Hauptarbeit ist saubere Projektinitialisierung plus Prisma-Setup; UI noch bewusst klein.

### M2 — Startseite & Level-Auswahl

Deliverables:

- Landing Page `/` mit Hero, Titel `KidsCode`, animiertem Roboter-Maskottchen und Start-CTA.
- Level-Cards fuer Beginner, Intermediate, Expert mit Icons, Beschreibungen, Lektionszahlen und Hover-Animation.
- Route `/courses/[level]` mit Kurs- und Lektionsuebersicht inklusive Fortschritts-Badges.
- Purple/Orange Theme mit kindgerechter Typografie.
- Responsive Layout fuer Tablet und Desktop.
- `HANDOVER_M2.md`.

Komplexitaet: Mittel. Viel sichtbares Frontend, aber geringe Business-Logik.

### M3 — Benutzerprofil ohne Auth

Deliverables:

- `/profile/new` fuer Namen und Emoji-Avatar-Auswahl.
- `POST /api/profile` zum Erstellen oder Laden eines lokalen Profils.
- Speicherung der `userId` in localStorage.
- `/profile` Dashboard mit Avatar, Name, XP, Streak, Badges und Kursfortschritt.
- Client-Guard: ohne Profil zu `/profile/new`.
- `HANDOVER_M3.md`.

Komplexitaet: Mittel bis hoch. Server- und Client-State muessen sauber zusammenspielen.

### M4 — Lektions-Screen & Theorie

Deliverables:

- `/courses/[level]/[lessonId]` mit Titel, Level-Badge, Fortschrittsbalken, Theorie und Code-Snippet-Styling.
- Maskottchen-Komponente mit Framer-Motion-Idle und Sprechblase.
- Breadcrumb Home -> Level -> Lektion.
- Button zur ersten bzw. naechsten Uebung.
- `HANDOVER_M4.md`.

Komplexitaet: Mittel. Wichtig ist die Datenmodell-Abfrage und klare Kind-UX.

### M5 — Multiple-Choice-Uebungen

Deliverables:

- Exercise-Screen fuer `MULTIPLE_CHOICE` mit vier Antwort-Buttons im 2x2 Grid.
- Sofortfeedback: richtig mit gruenem Glow und Konfetti, falsch mit rotem Shake.
- XP-Gutschrift und Progress via `POST /api/progress`.
- Abschluss-Screen fuer fertige Lektionen mit Badge-Vergabe und XP-Animation.
- Badge `Erster Schritt` nach erster abgeschlossener Lektion.
- `HANDOVER_M5.md`.

Komplexitaet: Hoch. Fortschritt, XP, idempotente Updates und UI-Feedback duerfen sich nicht doppelt ausloesen.

### M6 — Code-Editor & Lueckentext-Uebungen

Deliverables:

- Wiederverwendbare `CodeEditor` Komponente mit CodeMirror 6.
- `CODE_GAP` mit vorbefuelltem Template und `____`-Luecken.
- `FREE_CODE` mit leerem bzw. starterbasiertem Editor.
- Pyodide-Runner mit lazy-load, Run-Button, Terminal-Output und einfacher Output-Validierung.
- Sandboxed HTML-Preview im iframe.
- Kindgerechte Syntaxfehler-Hinweise.
- `HANDOVER_M6.md`.

Komplexitaet: Hoch. Pyodide muss client-only geladen werden, CodeMirror SSR-sicher integriert werden.

### M7 — Gamification & Polish

Deliverables:

- Streak-Logik in Server-Helper/API: taegliche Aktivitaet, Fortsetzung oder Reset.
- Mindestens acht Badge-Regeln mit idempotenter Vergabe.
- XP-Count-up Animation im Dashboard.
- Level-Up-Screen fuer abgeschlossene Beginner-Inhalte.
- `/leaderboard` mit Top-10 XP aus der DB.
- Mobile-Responsive Pass fuer 360px.
- Skeleton-Loading-States fuer async Bereiche.
- `HANDOVER_M7.md`.

Komplexitaet: Hoch. Viele Querschnittsfunktionen, hoehere Regression-Gefahr.

### M8 — Inhalte auffuellen & Dokumentation

Deliverables:

- Seed erweitert auf Beginner, Intermediate und Expert gemaess `KONZEPT.md`.
- Beginner: 5 Python-Lektionen + 3 HTML-Lektionen mit je 3-4 Exercises.
- Intermediate: 5 Lektionen zu Schleifen, Funktionen, Listen, CSS, JS-Intro.
- Expert: 3 Lektionen zu C-Intro, OOP Python, Mini-Projekt.
- Vollstaendiges `README.md` mit Beschreibung, Screenshots/Platzhalter, Setup und Roadmap.
- `KIDSCODE_FINAL_REPORT.md` mit gebautem Stand und Produktionsluecken.
- Git-Tag `v0.1.0-mvp`.
- Telegram-Nachricht an Rudi nach Abschluss.

Komplexitaet: Mittel bis hoch. Inhaltlich umfangreich, technisch vor allem Seed- und Dokumentationsarbeit.

## Qualitaetsstrategie

- Nach jeder Phase: `npm run build`, `npm run typecheck`, `npm run lint`.
- Wenn `typecheck` im initialen Next.js Template fehlt, wird ein Script `tsc --noEmit` ergaenzt.
- Jede Phase bekommt genau einen Handover mit Smoke-Test und offenen Punkten.
- Commits werden phasenweise gesetzt, damit jeder Meilenstein reviewbar bleibt.
- Seed-Daten werden idempotent per `upsert` geschrieben.
- Keine Secrets, keine produktionsnahen Kinderprofile, keine Auth im MVP.

## Risiken und Gegenmassnahmen

- **create-next-app in bestehendem Ordner:** vorhandene Konzept- und Bilddateien bleiben erhalten; generierte App-Dateien werden bewusst neu erstellt.
- **Pyodide Bundle-Groesse:** Import nur in clientseitigem Runner und erst bei Python-Ausfuehrung.
- **Doppelte XP/Badges:** Progress und Badge-Vergabe werden idempotent ueber Unique Constraints und Serverlogik abgesichert.
- **SQLite JSON-Felder:** `options` wird als Prisma `Json?` gespeichert; bei UI-Nutzung werden Daten validiert und defensiv normalisiert.
- **Mobile UI fuer Kinder:** grosse Touch-Ziele, klare Kontraste, keine textlastigen Screens.

# Astra — KidsCode Platform: Autonome Entwicklung

Du bist **Astra**, ein autonomer Full-Stack-Entwicklungs-Agent.
Projekt-Verzeichnis: `/Users/rudi/Projects/kidscode-platform`
Arbeite vollständig autonom. Wenn du Entscheidungen triffst, dokumentiere sie im HANDOVER.

---

## PHASE-PLAN (entwickle diesen zuerst als DEVPLAN.md)

Bevor du eine Zeile Code schreibst, erstelle `/Users/rudi/Projects/kidscode-platform/DEVPLAN.md`
mit einem detaillierten Entwicklungsplan. Der Plan soll:
- Alle Phasen M1–M8 auflisten (s.u.) mit klaren Deliverables
- Tech-Stack-Entscheidungen begründen
- Datenbankschema entwerfen (User, Course, Lesson, Exercise, Progress, Badge)
- Komponentenstruktur skizzieren
- Geschätzte Komplexität pro Phase

Committe DEVPLAN.md dann mit: `git commit -m "docs: DEVPLAN v1 — autonomer Entwicklungsfahrplan"`

---

## MEILENSTEINE (sequenziell abarbeiten)

### M1 — Projektaufbau & Grundgerüst
**Ziel:** Lauffähiges Next.js-Projekt mit DB-Schema und Basis-Layout

Aufgaben:
1. `npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --no-turbopack` (im Projektordner, bestehende Dateien überschreiben)
2. Installiere: `shadcn/ui`, `framer-motion`, `prisma`, `@prisma/client`, `codemirror`, `@codemirror/lang-python`, `@codemirror/lang-html`
3. Prisma-Schema anlegen (`prisma/schema.prisma`) mit diesen Modellen:
   - `User` (id, username, avatar, createdAt, xp, streak, lastActiveAt)
   - `Course` (id, title, level: BEGINNER|INTERMEDIATE|EXPERT, description, order)
   - `Lesson` (id, courseId, title, language, theory, order)
   - `Exercise` (id, lessonId, type: MULTIPLE_CHOICE|CODE_GAP|FREE_CODE, question, options?, correctAnswer, hint, xpReward)
   - `Progress` (id, userId, exerciseId, completed, correct, attempts, completedAt)
   - `Badge` (id, userId, name, icon, earnedAt)
4. `npx prisma generate && npx prisma db push`
5. Seed-Script mit: 2 Courses (Beginner Python, Beginner HTML), je 3 Lektionen, je 3 Exercises
6. Globales Layout: Header mit Logo + Nav, Footer, dark/light Mode
7. `npm run build` → 0 errors

Commit: `feat(M1): Next.js Grundgerüst, Prisma-Schema, Seed-Daten`
HANDOVER: `HANDOVER_M1.md` anlegen

---

### M2 — Startseite & Level-Auswahl
**Ziel:** Schöne Landing Page mit Animationen und Level-Auswahl

Aufgaben:
1. `/` — Hero Section: Titel "KidsCode", Untertitel, animierter Roboter-Mascot (SVG oder Lottie-like mit Framer Motion), "Jetzt starten!" Button
2. Level-Cards: drei Cards (Beginner/Intermediate/Expert) mit Icon, Beschreibung, Anzahl Lektionen, Hover-Animation
3. `/courses/[level]` — Kurs-Übersicht: alle Lektionen des Levels als Cards mit Fortschritts-Badge
4. Farb-Theme: Purple (#7C3AED) + Orange (#F97316), kindgerechte Typografie (Nunito oder Poppins)
5. Responsive für Tablet (768px) und Desktop
6. Framer Motion: fade-in-up Animationen für alle Cards
7. `npm run build` → 0 errors

Commit: `feat(M2): Landing Page, Level-Auswahl, Kurs-Übersicht`
HANDOVER: `HANDOVER_M2.md`

---

### M3 — Benutzerprofil (vereinfacht, ohne Auth)
**Ziel:** Profil erstellen und lokal speichern (localStorage + DB)

Aufgaben:
1. `/profile/new` — Profil-Erstell-Seite: Name eingeben, Avatar aus 6 Optionen wählen (Emoji-Avatare genügen: 🤖🦊🐼🦄🐸🐻), "Los geht's!" Button
2. Profil in DB speichern (API Route: `POST /api/profile`)
3. `userId` in localStorage speichern (kein Login, vereinfacht für Kinder)
4. `/profile` — Profil-Dashboard:
   - Avatar + Name + XP-Anzeige
   - Streak-Anzeige mit Flammen-Icon
   - Earned Badges Grid
   - Fortschritts-Übersicht pro Kurs (Fortschrittsbalken)
5. Navigation: Wenn kein Profil → Redirect zu `/profile/new`
6. `npm run build` → 0 errors

Commit: `feat(M3): Profil-System, Dashboard, XP-Anzeige`
HANDOVER: `HANDOVER_M3.md`

---

### M4 — Lektions-Screen & Theorie
**Ziel:** Lektion öffnen, Theorie lesen, weiter zur Übung

Aufgaben:
1. `/courses/[level]/[lessonId]` — Lektions-Screen:
   - Lektions-Titel mit Level-Badge (farbiger Chip)
   - Fortschrittsbalken oben (Übung X von Y)
   - Theorie-Block: Text mit Code-Snippet (Syntax-Highlighting via `<pre>` + CSS, kein Editor nötig)
   - Maskottchen-Sprechblase rechts: erklärt das Konzept in 1–2 Kindersätzen
   - "Zur Übung!" Button → nächste Übung in der Lektion
2. Schöne Maskottchen-Komponente: SVG-Roboter mit einfacher idle Animation (Framer Motion: leichtes Schaukeln)
3. Breadcrumb: Home → Level → Lektion
4. `npm run build` → 0 errors

Commit: `feat(M4): Lektions-Screen, Theorie-Anzeige, Maskottchen`
HANDOVER: `HANDOVER_M4.md`

---

### M5 — Multiple-Choice-Übungen
**Ziel:** MC-Fragen mit Animation und Feedback

Aufgaben:
1. Exercise-Typ `MULTIPLE_CHOICE`: 4 Antwort-Buttons in Grid (2×2)
2. Klick → sofortiges visuelles Feedback: Richtig = grüner Glow + Konfetti-Burst (Framer Motion Partikel), Falsch = roter Shake-Effekt
3. Nach Antwort: "Weiter" Button erscheint, XP werden gutgeschrieben
4. Progress in DB speichern: `POST /api/progress`
5. Wenn alle Übungen einer Lektion abgeschlossen: Lektion-Abschluss-Screen mit Badge-Vergabe + XP-Animation
6. Badges auto-vergeben: Erste Lektion abgeschlossen = "Erster Schritt" Badge
7. `npm run build` → 0 errors

Commit: `feat(M5): Multiple-Choice, Konfetti-Feedback, Fortschritts-Tracking`
HANDOVER: `HANDOVER_M5.md`

---

### M6 — Code-Editor & Lückentext-Übungen
**Ziel:** Python/HTML-Code im Browser schreiben und ausführen

Aufgaben:
1. CodeMirror 6 Integration als React-Komponente (`<CodeEditor language="python" value=... onChange=...>`)
2. Exercise-Typ `CODE_GAP`: Code-Template mit `____`-Lücken anzeigen, Kind füllt aus
3. Exercise-Typ `FREE_CODE`: Leerer Editor, Kind schreibt eigenen Code
4. Python-Ausführung via Pyodide (lazy-load, nur wenn Python-Übung):
   - "Ausführen ▶" Button → Code an Pyodide, Output in Terminal-Box unten
   - Validierung: prüfe ob Output den erwarteten Wert enthält
5. HTML-Preview: sandboxed `<iframe>` zeigt gerendetes HTML in Echtzeit
6. Syntax-Fehler-Anzeige: freundlich formuliert ("Hmm, da fehlt noch ein Anführungszeichen 🤔")
7. `npm run build` → 0 errors

Commit: `feat(M6): CodeMirror Editor, Pyodide Python-Ausführung, HTML-Preview`
HANDOVER: `HANDOVER_M6.md`

---

### M7 — Gamification & Polish
**Ziel:** Streak-System, alle Badges, XP-Animationen, finaler Schliff

Aufgaben:
1. Streak-Logik: `lastActiveAt` täglich prüfen, Streak +1 wenn heute aktiv, 0 wenn Lücke
2. Badge-System komplett: mindestens 8 Badges definieren und auto-vergeben
3. XP-Counter-Animation auf dem Dashboard (Framer Motion count-up)
4. Level-Up-Screen: wenn alle Beginner-Kurse fertig → "Du bist jetzt auf Intermediate!" Transition
5. `/leaderboard` — Top-10 XP (aus DB, kein Auth nötig)
6. Responsive Bugfixes für Mobile (360px)
7. Loading States: Skeleton-Components für alle async Inhalte
8. `npm run build` → 0 errors

Commit: `feat(M7): Streak, alle Badges, XP-Animationen, Leaderboard`
HANDOVER: `HANDOVER_M7.md`

---

### M8 — Inhalte auffüllen & README
**Ziel:** Alle 3 Level mit echten Lektionen befüllt, Projekt dokumentiert

Aufgaben:
1. Seed-Script erweitern:
   - Level Beginner: 5 Lektionen Python + 3 HTML-Lektionen (je 3–4 Exercises)
   - Level Intermediate: 5 Lektionen (Schleifen, Funktionen, Listen, CSS, JS-Intro)
   - Level Expert: 3 Lektionen (C-Intro, OOP Python, Mini-Projekt-Anleitung)
   - Alle Lektionen mit echtem didaktischem Text aus `KONZEPT.md` befüllen
2. Vollständiges `README.md`:
   - Projektbeschreibung, Screenshots, Setup-Anleitung, Entwicklungs-Roadmap
3. `KIDSCODE_FINAL_REPORT.md` schreiben: was wurde gebaut, was fehlt noch für Produktion
4. Finaler `npm run build` → 0 errors
5. Git-Tag setzen: `git tag v0.1.0-mvp`

Commit: `feat(M8): vollständige Kursinhalte, README, MVP-Report`
Telegram an Rudi: `~/.hermes/scripts/rudel_tg.sh "🎉 KidsCode MVP fertig! Git-Repo: ~/Projects/kidscode-platform — alle 8 Meilensteine abgeschlossen. Zum Starten: cd ~/Projects/kidscode-platform && npm run dev"`

---

## HANDOVER-FORMAT (Pflicht nach jeder Phase)

```markdown
# HANDOVER M<N> — KidsCode Platform
Datum: YYYY-MM-DD
Phase: M<N> — <Phasenname>

## Was wurde gebaut
- <Datei/Komponente>: <Beschreibung>

## Getroffene Entscheidungen
- <Entscheidung>: <Begründung>

## Qualitäts-Gates
- [ ] npm run build → 0 errors
- [ ] npm run typecheck → 0 errors
- [ ] npm run lint → 0 errors

## Smoke-Test
- <Was getestet, was OK>

## Nächste Phase: M<N+1>
<Konkreter erster Schritt>

## Offene Punkte
- <Todo>
```

---

## WICHTIGE REGELN

1. **Erst DEVPLAN.md**, dann Code — kein Code ohne fertigen Plan
2. **Jeden Meilenstein committen** — kein "Alles auf einmal am Ende"
3. **Handover ist Pflicht** — auch wenn du glaubst, du schaffst M2 noch schnell: schreibe zuerst HANDOVER_M1
4. **Telegram am Ende** (M8): `~/.hermes/scripts/rudel_tg.sh "Text"` — das ist der einzige Weg Rudi zu erreichen
5. **npm run build muss grün sein** vor jedem Commit — nie kaputten Code committen
6. **Autonomie:** Entscheide selbst bei UI-Details, Komponenten-Namen, File-Struktur. Dokumentiere im HANDOVER.
7. **Pyodide** ist groß (~10MB) — lazy-load nur wenn Python-Lektion geöffnet wird
8. **Seed-Daten** immer idempotent schreiben (`upsert`, nie `create` ohne Prüfung)

## START

Beginne JETZT mit DEVPLAN.md. Lies zuerst KONZEPT.md im Projektordner.
Dann DEVPLAN schreiben, committen, und mit M1 starten.

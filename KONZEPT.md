# KidsCode Platform — Konzept & Planung

<style>
@page { margin: 20mm 12mm 14mm 12mm; }
html, body { font-size: 9.2pt; line-height: 1.28; }
h1 { font-size: 20pt; margin-bottom: 5mm; padding-bottom: 2mm; }
h2 { font-size: 13pt; margin-top: 4.5mm; padding-bottom: 1mm; }
h3 { font-size: 10.8pt; margin-top: 3mm; }
p, li { margin: 1.1mm 0; }
ul, ol { margin-top: 1.5mm; margin-bottom: 1.5mm; }
table { font-size: 8pt; margin: 2mm 0; }
tbody td, thead th { padding: 1mm 1.4mm; }
img:not([src*="logo"]):not([src*="xflight"]) {
  display: block;
  max-width: 100%;
  max-height: 105mm;
  width: auto;
  height: auto;
  object-fit: contain;
  margin: 2mm auto 3mm;
}
</style>

Stand: 16.09.2026

KidsCode ist eine geplante interaktive Lernplattform für Kinder ab etwa 5 bis 6 Jahren. Sie soll Programmieren nicht als trockene Syntaxübung vermitteln, sondern als spielerisches Bauen: Das Kind gibt einem Computer klare Befehle, sieht sofort das Ergebnis, korrigiert Fehler und schaltet sichtbar neue Fähigkeiten frei. Die Plattform kombiniert Multiple Choice, Code-Lückentexte, freie Code-Übungen, Benutzerprofil, Fortschritts-Tracking, animierte Charaktere und eine hochwertige, spielnahe UI.

## 1. Vision & Zielgruppe

Die Plattform richtet sich an Kinder in drei Stufen. **Beginner** ab ca. 5 bis 6 Jahren brauchen kurze Texte, starke Bilder, Vorlesen optional und Aufgaben, die in unter zwei Minuten ein Erfolgserlebnis geben. **Intermediate** ab ca. 8 bis 10 Jahren können mehr selbst lesen und schreiben; hier werden Schleifen, Funktionen, Listen und kleine Projekte wichtig. **Expert** ab ca. 12 Jahren darf echter und technischer werden: C-Grundlagen, objektorientiertes Denken, Algorithmen, JavaScript und ein kleines Spielprojekt.

Das Produktziel ist nicht "Kinder klicken sich durch Quizfragen", sondern: Kinder verstehen, dass Code ein Werkzeug ist, mit dem sie Dinge steuern, gestalten und erschaffen können. Jede Lerneinheit soll deshalb in einem kleinen sichtbaren Ergebnis enden: ein Satz im Output, ein Namensschild, eine Rechnung, eine erste Webseite, ein Mini-Taschenrechner oder später ein Spielobjekt.

## 2. Didaktische Grundlagen (aus Recherche)

Die Recherche zeigt einen klaren Konsens: Kinder lernen Programmieren am besten, wenn abstrakte Konzepte zuerst sichtbar, spielerisch und handlungsorientiert werden. Scratch, Code.org, Blockly, CS Unplugged, Minecraft Education, Lightbot und Tynker starten nicht mit Sprachtheorie, sondern mit Sequenzen, Figuren, Rätseln, Blöcken, Projekten und direktem Feedback.

**Scratch** ist stark, weil Kinder eigene Geschichten, Animationen und Spiele bauen. Der didaktische Kern ist Kreativität plus systematisches Denken: Ein Kind probiert etwas aus, sieht die Wirkung, ändert den Plan und teilt später ein Projekt. **Code.org** liefert die gute Makrostruktur: Kurse, Units, Lektionen und Aktivitäten, altersgestaffelt von K-5 bis High School. **CS Unplugged** zeigt, dass Informatik auch ohne Bildschirm funktioniert: Kinder verstehen Sequenzen, Sortieren oder Bedingungen über Bewegung, Karten und Spiele. **Blockly** ist die Brücke zwischen Logik und Textcode: Blöcke vermeiden Tippfrust, können aber echte Sprachen wie Python oder JavaScript erzeugen. **Lightbot** reduziert Coding auf Wegplanung und Debugging. **Minecraft Education** zeigt, wie Coding in einer Spielwelt Sinn bekommt. **Duolingo** liefert Muster für Motivation: kurze Sessions, Streaks, XP, sofortige Korrektur, Wiederholung nach Fehlern und personalisierte Übung.

Die wichtigsten Prinzipien für KidsCode:

- **Konkretes vor Abstraktem:** Erst Roboterweg, Bild, Ausgabe oder Webseite; danach der Fachbegriff.
- **Scaffolding:** Multiple Choice, dann Lückentext, dann Code sortieren, dann eigene Zeile, dann kleines Projekt.
- **Spiral Curriculum:** Variablen, Schleifen und Funktionen kommen mehrfach wieder, jedes Mal etwas tiefer.
- **Immediate Feedback:** Run-Button, Output und visuelle Reaktion müssen sofort sichtbar sein.
- **Fehlerfreundlichkeit:** Fehler sind kein Scheitern, sondern "Der Computer hat dich noch nicht verstanden."
- **Projektorientierung:** Jede Lektion zahlt auf ein kleines Artefakt ein.

Multiple Choice und Code-Schreiben ergänzen sich. Multiple Choice prüft schnell, ob das Kind ein Konzept erkennt: Welche Zeile ist richtig? Was macht `print()`? Warum braucht `if` einen Doppelpunkt? Code-Schreiben prüft Transfer: Kann das Kind den eigenen Namen einsetzen, eine Zahl ändern oder eine kleine Funktion bauen? Für junge Kinder sollte Code-Schreiben zunächst Lückentext sein; freies Schreiben kommt schrittweise später.

## 3. Sprachauswahl & Begründung

Die empfohlene Kernreihenfolge ist **Python → HTML/CSS → JavaScript**. **C** kommt nur als Expert-Spur dazu.

| Sprache | Rolle in KidsCode | Warum geeignet | Risiko |
|---|---|---|---|
| Python | erste Textsprache | lesbar, wenig Boilerplate, ideal für Logik, Variablen, Schleifen, kleine Tools | Einrückung und Strings müssen gut erklärt werden |
| HTML/CSS | früher Kreativpfad | sofort sichtbares Ergebnis, persönliche Webseiten, Farben und Layout | HTML ist keine klassische Programmiersprache; CSS kann schnell komplex werden |
| JavaScript | Web-Interaktion ab Intermediate/Expert | Buttons, Eingaben, Animationen und Browser-Spiele | mehr Sonderfälle und komplexere Syntax |
| C/C++ | Expert/Wahlpfad ab ca. 12 | Maschinennähe, Typen, Kompilierung, Game-/Embedded-Bezug | hoher Syntax- und Fehlerdruck |

Python ist der beste erste Textpfad, weil ein Kind mit `print("Hallo")` sofort Wirkung sieht. HTML/CSS sollte früh parallel auftauchen, weil visuelles Gestalten extrem motivierend ist. JavaScript wird relevant, sobald Webseiten auf Klicks reagieren sollen. C ist sinnvoll, wenn ein Kind bereits Variablen, Funktionen und Debugging verstanden hat; vorher wäre der Frust durch Boilerplate und Compilerfehler zu hoch.

## 4. Kursstruktur

### 4.1 Level 1 — Beginner

**Level-Ziel:** Das Kind versteht Befehle, Ausgabe, Werte, einfache Entscheidungen und baut eine erste Webseite. Jede Lektion enthält 3 Multiple-Choice-Fragen und 1 Code-Schreibaufgabe.

**Lektion 1: Hallo Welt in Python**  
Lernziel: Das Kind erkennt, dass ein Computer einen klaren Befehl ausführt. Erklärung: `print()` ist wie ein Sprachknopf für den Computer. Beispiel: `print("Hallo!")`. MC: 1. Welcher Code zeigt Hallo? Antwort `print("Hallo!")`. 2. Was macht `print()`? Antwort: Text anzeigen. 3. Was gehört um Text? Antwort: Anführungszeichen. Code-Aufgabe: `print("____")` mit eigenem Wort füllen. Badge: "Erster Befehl".

**Lektion 2: Variablen**  
Lernziel: Das Kind versteht Variablen als beschriftete Boxen. Erklärung: Auf der Box steht `name`, innen liegt `"Max"`. Beispiel: `name = "Max"; print("Hallo " + name)`. MC: 1. Richtig speichern: `name = "Max"`. 2. Was liegt in `name`? Antwort: Text. 3. Ergebnis bei `name = "Mia"`? Antwort: `Hallo Mia`. Code-Aufgabe: eigenen Namen in `name = "____"` einsetzen. Badge: "Namens-Zauber".

**Lektion 3: Einfache Berechnungen**  
Lernziel: Das Kind nutzt den Computer als schnellen Rechner. Erklärung: Zahlen können in Boxen liegen und kombiniert werden. Beispiel: `alter = 6; print(alter + 1)`. MC: 1. `2 + 3` ergibt `5`. 2. Richtig ist `punkte = 10 + 5`. 3. `zahl = 4; print(zahl + 2)` zeigt `6`. Code-Aufgabe: eigenes Alter eintragen und Alter im nächsten Jahr ausgeben. Badge: "Zahlen-Zauberer".

**Lektion 4: Entscheidungen mit `if`**  
Lernziel: Das Kind versteht Bedingungen als Weggabelung. Erklärung: Wenn ein Schild passt, nimmt der Roboter diesen Weg, sonst den anderen. Beispiel: `if name == "Max": print("Hallo Max!") else: print("Hallo Freund!")`. MC: 1. Vergleichen nutzt `==`. 2. Bei passendem Namen läuft der erste Zweig. 3. Die Alternative heißt `else`. Code-Aufgabe: Geheimnamen einsetzen und testen. Badge: "Türwächter".

**Lektion 5: HTML - Meine erste Webseite**  
Lernziel: Das Kind erkennt HTML als Baukasten für Webseiten. Erklärung: `<h1>` ist ein großes Schild, `<p>` ist ein Textblock. Beispiel: `<h1>Meine Homepage</h1><p>Ich lerne Programmieren!</p>`. MC: 1. Überschrift: `<h1>Hallo</h1>`. 2. Absatz: `<p>Text</p>`. 3. Richtig geschlossen: `<h1>Meine Seite</h1>`. Code-Aufgabe: Titel und Satz in eine Mini-Homepage eintragen. Badge: "Webseiten-Baumeister".

### 4.2 Level 2 — Intermediate

**Level-Ziel:** Das Kind schreibt mehr eigenen Code und kombiniert Konzepte zu kleinen Werkzeugen. Jede Lektion enthält 2 Multiple-Choice-Fragen und 2 Code-Aufgaben.

**Lektion 1: `for`-Schleifen**  
Lernziel: Wiederholung ohne Copy-Paste. Erklärung: Eine Schleife ist "mach diesen Tanzschritt fünfmal". Beispiel: `for i in range(5): print("Hallo!")`. MC: richtige Wiederholung ist `for i in range(5):`; `range(3)` erzeugt drei Durchläufe. Code-Aufgaben: viermal `Rakete startet!` ausgeben; Lücke in `range(____)` für sechs Wiederholungen füllen. Badge: "Loop Master".

**Lektion 2: `while`-Schleifen**  
Lernziel: Wiederholen, solange eine Bedingung gilt. Erklärung: Solange Energie da ist, läuft der Roboter. Beispiel: `energie = 3; while energie > 0: print("läuft"); energie = energie - 1`. MC: `while energie > 0` bedeutet "solange Energie größer 0"; das Verringern verhindert Endlosschleifen. Code-Aufgaben: Countdown von 3 bis 1 bauen; Schleife mit `versuche` schreiben. Badge: "Countdown-Kapitän".

**Lektion 3: Funktionen**  
Lernziel: Eigene wiederverwendbare Mini-Maschinen bauen. Erklärung: Eine Funktion ist wie ein Rezept. Beispiel: `def begruessen(name): print("Hallo " + name)`. MC: Funktionen starten mit `def`; `name` ist ein Platzhalter. Code-Aufgaben: `jubeln()` schreibt `Juhu!`; Funktion `tier_sagen(tier)` mit eigenem Tier aufrufen. Badge: "Mini-Maschinenbauer".

**Lektion 4: Listen**  
Lernziel: Mehrere Werte speichern und auslesen. Erklärung: Eine Liste ist ein Regal, Python zählt ab 0. Beispiel: `farben = ["rot", "blau", "gruen"]; print(farben[0])`. MC: `farben[0]` ist `rot`; richtige Syntax ist `tiere = ["Katze", "Hund"]`. Code-Aufgaben: drei Lieblingsessen speichern; aus `[10, 20, 30]` die `30` ausgeben. Badge: "Listen-Sammler".

**Lektion 5: Dictionaries**  
Lernziel: Schlüssel-Wert-Paare verstehen. Erklärung: Ein Dictionary ist ein Steckbrief. Beispiel: `profil = {"name": "Lina", "alter": 9}; print(profil["name"])`. MC: `profil["name"]` zeigt `Lina`; ein Dictionary passt zu einem Steckbrief. Code-Aufgaben: `held` mit `name` und `kraft` bauen; aus `roboter` den Namen lesen. Badge: "Steckbrief-Profi".

**Lektion 6: Mini-Projekt Taschenrechner**  
Lernziel: Variablen, Funktionen und Rechnen verbinden. Erklärung: Das Kind baut ein eigenes kleines Werkzeug. Beispiel: `def addieren(a, b): return a + b`. MC: `return` gibt ein Ergebnis zurück; `addieren(4, 5)` ergibt `9`. Code-Aufgaben: `verdoppeln(zahl)` bauen; `subtrahieren(a, b)` ergänzen. Badge: "Tool-Erfinder".

### 4.3 Level 3 — Expert

**Level-Ziel:** Das Kind arbeitet mit echterer Technik, lernt Typen, Objekte, Algorithmen und Web-Interaktion. Pro Lektion: 1 bis 2 MC-Fragen, 1 bis 2 Code-Aufgaben.

**Lektion 1: C-Grundlagen**  
Lernziel: Aufbau eines C-Programms verstehen. Erklärung: C ist genauer und näher an der Maschine als Python. Beispiel: `#include <stdio.h>; int main(void) { printf("Hallo C!\\n"); return 0; }`. MC: Startfunktion ist `main`; Textausgabe nutzt `printf`. Code-Aufgaben: Text ändern; zweite `printf`-Zeile ergänzen. Badge: "C-Starter".

**Lektion 2: Zahlen und Typen in C**  
Lernziel: `int` und `float` unterscheiden. Erklärung: Ein Datentyp ist ein Etikett auf einer Box. Beispiel: `int punkte = 10; float zeit = 3.5;`. MC: `10` passt zu `int`; `%d` gibt ganze Zahlen aus. Code-Aufgaben: `leben = 3` anlegen; Wert mit `printf` ausgeben. Badge: "Typen-Versteher".

**Lektion 3: Klassen und Objekte in Python**  
Lernziel: Objekte als Dinge mit Eigenschaften und Fähigkeiten verstehen. Erklärung: Eine Klasse ist der Bauplan, ein Objekt die Spielfigur. Beispiel: `class Roboter: ... byte = Roboter("Byte")`. MC: Klasse = Bauplan; `byte` = Objekt. Code-Aufgaben: `nova = Roboter("Nova")`; Methode `tanzen()` ergänzen. Badge: "Objekt-Architekt".

**Lektion 4: Algorithmisches Denken - Suchen**  
Lernziel: Eine Liste Schritt für Schritt durchsuchen. Erklärung: Wie Karten ansehen, bis die richtige gefunden ist. Beispiel: `for zahl in zahlen: if zahl == gesucht: print("Gefunden!")`. MC: Schleife schaut jedes Element an; `==` vergleicht mit dem Suchwert. Code-Aufgaben: Suchwert ändern; Fall "Nicht gefunden" ergänzen. Badge: "Spurenleser".

**Lektion 5: Algorithmisches Denken - Sortieren**  
Lernziel: Sortieren als Vergleichen und Ordnen begreifen. Erklärung: Karten nach Größe hinlegen. Beispiel: `zahlen = [3, 1, 2]; zahlen.sort(); print(zahlen)`. MC: `sort()` ordnet; Ergebnis ist `[1, 2, 3]`. Code-Aufgaben: vier Punktzahlen sortieren; kleinste und größte Zahl ausgeben. Badge: "Sortier-Meister".

**Lektion 6: Web und Spiel - JavaScript plus Python-Game**  
Lernziel: Code reagiert auf Ereignisse. Erklärung: Ein Spiel schaut immer wieder, ob etwas passiert. Beispiel Web: `button.onclick = () => score += 1`. Beispiel Game: Pygame-Schleife mit `while running`. MC: Ein Event ist eine Aktion wie Klick oder Taste; eine Game Loop hält das Spiel aktiv. Code-Aufgaben: Button-Zähler ändern; Kreisfarbe im Pygame-Beispiel ändern. Badge: "Game Maker".

## 5. Lektions-Format (MC + Code-Schreiben)

Der Standardablauf einer Lektion ist: Intro-Szene, Mini-Erklärung, Beispiel ausführen, Multiple Choice, direktes Feedback, Code-Aufgabe, Run, Belohnung. Das Kind soll nie lange suchen müssen, was als Nächstes zu tun ist.

Aufgabentypen:

- **MC "Welcher Code ist richtig?"** prüft Erkennen und typische Fehler: fehlende Anführungszeichen, falsches `=`, fehlender Doppelpunkt, falsche HTML-Tags.
- **Lückentext** ist ideal für junge Kinder, weil der Großteil des Codes schon sicher steht.
- **Code-Blöcke sortieren** trainiert Reihenfolge ohne Tippfrust.
- **Freies Schreiben** kommt ab Intermediate häufiger und braucht gute Fehlerhilfe.

Die Fehlertexte müssen kindgerecht sein. Statt `SyntaxError` sollte die UI sagen: "Nach `if` fehlt ein Doppelpunkt" oder "Text braucht Anführungszeichen." Nach mehreren Fehlern gibt es eine kleine Hilfe, nicht sofort die komplette Lösung.

## 6. Plattform-Features

**Benutzerprofil:** Kind erstellt Namen oder Spitznamen, Avatar, Lieblingsfarbe und sieht Level, XP, Streak, Abzeichen und nächste Lektion. Eltern sehen zusätzlich Fortschritt, Lernzeit, starke Themen und schwierige Themen.

**Lernpfad-Auswahl:** Drei Pfade als Karte: Roboter-Werkstatt für Beginner, Code-Labor für Intermediate, Erfinder-Akademie für Expert. Jeder Pfad zeigt Altersempfehlung, Themen, Fortschritt und nächstes Badge.

**In-Browser Code-Editor:** Syntax-Highlighting, Run-Button, Output, Reset, Undo/Redo, kindgerechte Fehlerhilfe, optionaler Blockmodus, HTML/CSS Live Preview. CodeMirror 6 ist für Kinder wahrscheinlich besser als Monaco; Monaco kann im Expert-Modus angeboten werden.

**Multiple-Choice-UI:** Große Antwortkarten, direkte Rückmeldung, zweiter Versuch, kurzer Grund für richtig/falsch, keine harte Fehleranimation.

**Fortschritts-Tracking:** XP, Abzeichen, Wochenziel, Streak, Streak-Schutz, Avatar-Freischaltungen und Konzept-Mastery. Gamification soll Lernfortschritt sichtbar machen, nicht Druck erzeugen.

**Animierte Charaktere:** Das Maskottchen "Byte" erklärt, hilft beim Debuggen und feiert Abschlüsse. Benötigte Zustände: neutral, erklärend, nachdenklich, jubelnd, Fehlerhilfe.

**Triple-A Grafik konkret:** hochwertige Illustrationen, flüssige Mikroanimationen, Partikeleffekte bei Erfolgen, polierte Übergänge, starke visuelle Hierarchie, optional Sound. Auf Lernscreens bleibt der Code ruhig und lesbar; Effekte erscheinen hauptsächlich bei Feedback und Abschluss.

## 7. UI/UX Konzept

### Bild 1: Hero / Landing Page

![Hero UI](/Users/rudi/.hermes/workspace/kidscode-platform/ui_hero.png)

### Bild 2: Code-Editor Lernscreen

![Lesson UI](/Users/rudi/.hermes/workspace/kidscode-platform/ui_lesson.png)

### Bild 3: Kinderprofil / Dashboard

![Dashboard UI](/Users/rudi/.hermes/workspace/kidscode-platform/ui_dashboard.png)

### Bild 4: Maskottchen-Konzept

![Mascot Concept](/Users/rudi/.hermes/workspace/kidscode-platform/mascot_concept.png)

### Bild 5: Python-Aufgaben-Screen (Lückentext)

![Python Aufgabe](/Users/rudi/.hermes/workspace/kidscode-platform/ui_aufgabe_python.png)

Der Aufgaben-Screen zeigt den Code-Editor mit einer klar markierten Lücke. Das Maskottchen zeigt mit dem Finger auf die fehlende Stelle. Vier Antwort-Optionen sind farbig hervorgehoben — richtige Antwort löst Konfetti aus.

### Bild 6: HTML-Aufgaben-Screen (Live-Vorschau)

![HTML Aufgabe](/Users/rudi/.hermes/workspace/kidscode-platform/ui_aufgabe_html.png)

Das Split-Screen-Layout zeigt links den HTML-Editor, rechts die Live-Browser-Vorschau. Kinder sehen sofort wie ihr Code aussieht — unmittelbares visuelles Feedback ist entscheidend für den Lernerfolg.

### Bild 7: Level-Abschluss-Belohnung

![Belohnung](/Users/rudi/.hermes/workspace/kidscode-platform/ui_belohnung.png)

Nach Abschluss eines Levels explodiert ein Konfetti-Screen mit dem neuen Badge, dem XP-Zähler und dem Weiter-Button. Dieser emotionale Moment ist zentral für die Motivation — ähnlich wie bei Duolingo's Streak-Feier.

UX-Regeln: Ein Screen hat genau ein Hauptziel. Buttons sind groß genug für Tablet-Nutzung. Der Editor zeigt nur relevante Zeilen. Fortschritt ist dauerhaft sichtbar, aber nicht dominant. Animationen belohnen Aktionen, lenken aber nicht während des Tippens ab. Kontrast, reduzierte Bewegung, Tastaturbedienung und Vorlesefunktion sollten von Anfang an mitgedacht werden.

## 8. Tech-Stack-Empfehlung

Empfohlener Stack:

- **Next.js + React + TypeScript** für App, Routing, Komponenten und langfristige Wartbarkeit.
- **CodeMirror 6** als Standard-Editor; **Monaco** optional im Expert-Modus.
- **Pyodide** für Python im Browser.
- **sandboxed iframe** für HTML/CSS und JavaScript-Vorschau.
- **PostgreSQL + Prisma** für Profile, Lektionen, Attempts, XP, Badges und Streaks.
- **Rive oder Lottie** für Maskottchen-Animationen.
- **Framer Motion oder CSS Motion Tokens** für UI-Feedback.

Für C sollte der MVP keine freie Kompilierung anbieten. Besser sind kuratierte Übungen oder später eine isolierte serverseitige Ausführung mit Zeit- und Speicherlimits. Datenschutz ist zentral: Spitznamen statt Klarnamen, Elternkonto, keine öffentlichen Kinderprofile, keine offenen Chats, sichere Code-Ausführung und klare Löschfunktion.

## 9. Entwicklungs-Roadmap

**Phase 0: Produktentscheidung, 1 bis 2 Wochen.** Name, Zielalter MVP, Tonalität, Maskottchen, Python-first-Entscheidung.

**Phase 1: UX-Prototyp, 2 bis 4 Wochen.** Landing, Profil, Level-Auswahl, eine vollständige Beginner-Lektion, statisches Dashboard, 2 bis 3 Maskottchenzustände.

**Phase 2: Lern-MVP, 6 bis 10 Wochen.** Account, Kinderprofil, CodeMirror, Pyodide, Output-Fenster, MC-Komponente, Fortschritt, Beginner-Level mit 5 Lektionen, erste Abzeichen.

**Phase 3: Intermediate und Projektmodus, 6 bis 8 Wochen.** Schleifen, Funktionen, Listen, Dictionaries, HTML/CSS-Vorschau, Taschenrechner-Projekt, bessere Fehlerhilfe.

**Phase 4: Polishing und Gamification, 4 bis 8 Wochen.** Avatar-Freischaltungen, Streak-Schutz, Level-Karte, Animationen, Sound optional, Accessibility-Pass.

**Phase 5: Expert-Pfad, 8 bis 12 Wochen.** C-Grundlagen, JavaScript, Algorithmen, Python-OOP, Pygame- oder Browser-Spiel, sichere Ausführungsumgebung.

**Phase 6: Beta mit Kindern, laufend.** Testen, ob Kinder den Ablauf ohne Erklärung verstehen, wo Tippfehler entstehen, welche Belohnungen motivieren und welche Aufgaben zu schwer sind.

## 10. Quellen & Inspiration

- Scratch Educators: https://scratch.mit.edu/educators/
- Scratch Research: https://scratch.mit.edu/research
- Code.org Curriculum: https://code.org/en-US/curriculum
- Code.org Elementary School: https://code.org/en-US/curriculum/elementary-school
- CS Unplugged: https://www.csunplugged.org/
- Blockly: https://www.blockly.com/
- Blockly Developer Docs: https://developers.google.com/blockly
- Raspberry Pi Foundation, Python for Kids: https://www.raspberrypi.org/blog/python-coding-for-kids-beyond-the-basics/
- Raspberry Pi Foundation, HTML/CSS: https://www.raspberrypi.org/blog/learning-html-and-css/
- Minecraft Education Coding Curriculum: https://education.minecraft.net/en-us/blog/the-why-and-how-building-full-coding-curriculum-using-minecraft-
- Lightbot: https://lightbot.com/
- Tynker: https://www.tynker.com/
- Duolingo 101: https://blog.duolingo.com/duolingo-101-how-to-learn-a-language-on-duolingo/
- Duolingo Streaks: https://blog.duolingo.com/how-streaks-keep-duolingo-learners-committed-to-their-language-goals/
- Duolingo Math: https://blog.duolingo.com/duolingo-launches-math-app/
- Computational Thinking in Early Childhood Education: https://pmc.ncbi.nlm.nih.gov/articles/PMC10577223/
- Unplugged Activities Meta-Analysis: https://link.springer.com/article/10.1186/s40594-023-00434-7

## Anhang A: Zwei vollständig ausgearbeitete Beispiel-Lektionen

### Beispiel-Lektion A: Hallo Welt in Python

Story: Byte der Roboter wacht auf und kann noch nicht sprechen. Das Kind bringt ihm das erste Wort bei. Auf dem Screen steht `print("Hallo!")`; der Run-Button pulsiert. Nach Klick erscheint `Hallo!` im Output. Erklärung: `print` ist ein Befehl; alles in Anführungszeichen wird angezeigt.

MC-Fragen: 1. Richtig ist `print("Hallo!")`, nicht `print Hallo!`. 2. Anführungszeichen zeigen Python, dass es Text ist. 3. Wenn der Text geändert wird, zeigt der Output den neuen Text.

Code-Aufgabe: `print("____")` mit eigenem Wort füllen. Validierung: ausführbarer Code mit nicht leerem Text. Fehlerhilfe: "Text braucht zwei Anführungszeichen" oder "Die Klammer hält den Text fest." Belohnung: 20 XP, Badge "Erster Befehl", Byte winkt.

### Beispiel-Lektion B: `for`-Schleifen

Story: Byte soll fünf Sterne sammeln. Erst sieht das Kind fünf wiederholte `print("Stern")`-Zeilen. Dann zeigt die Plattform die kürzere Lösung: `for i in range(5): print("Stern")`. Erklärung: `range(5)` heißt "fünfmal", die eingerückte Zeile ist der wiederholte Befehl.

MC-Fragen: 1. Die Wiederholung startet mit `for i in range(5):`. 2. Die eingerückte Zeile gehört zur Schleife. Code-Aufgabe 1: dreimal `Rakete` ausgeben. Code-Aufgabe 2: Lücke in `range(____)` für sieben Münzen füllen. Validierung: Output enthält die erwartete Anzahl Zeilen. Fehlerhilfe: fehlender Doppelpunkt, fehlende Einrückung oder falsche Zahl werden einzeln erklärt. Belohnung: 40 XP, Badge "Loop Master", Sterneffekt.

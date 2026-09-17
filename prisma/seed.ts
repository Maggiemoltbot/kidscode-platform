import { prisma } from "../src/lib/prisma";
import { ExerciseType, Level, Prisma } from "@prisma/client";
import { courseTranslations, lessonTranslations, exerciseTranslations } from "./translations";

type SeedExercise = {
  id: string;
  type: ExerciseType;
  question: string;
  options: string[] | null;
  correctAnswer: string;
  hint: string;
  xpReward: number;
};

type SeedLesson = {
  id: string;
  title: string;
  language: string;
  theory: string;
  order: number;
  exercises: SeedExercise[];
};

type SeedCourse = {
  id: string;
  title: string;
  level: Level;
  description: string;
  order: number;
  lessons: SeedLesson[];
};

const courses: SeedCourse[] = [
  {
    id: "course-beginner-python",
    title: "Beginner Python",
    level: Level.BEGINNER,
    description: "Erste Befehle, Variablen, Rechnungen, Entscheidungen und Debugging mit Python.",
    order: 1,
    lessons: [
      {
        id: "lesson-python-hallo-welt",
        title: "Hallo Welt in Python",
        language: "python",
        theory:
          "Programmieren beginnt mit einem sichtbaren Ergebnis. Mit print() kann Python etwas im Terminal sagen. Text steht in Anführungszeichen. Kinder sollen zuerst sehen: Ich schreibe eine Zeile, der Computer antwortet sofort.",
        order: 1,
        exercises: [
          {
            id: "exercise-python-hallo-mc-1",
            type: ExerciseType.MULTIPLE_CHOICE,
            question: "Welche Zeile zeigt Hallo auf dem Bildschirm?",
            options: ['print("Hallo!")', "show Hallo", 'print(Hallo!")', "Hallo.print()"],
            correctAnswer: 'print("Hallo!")',
            hint: "Python benutzt print() und Text steht zwischen zwei Anführungszeichen.",
            xpReward: 10,
          },
          {
            id: "exercise-python-hallo-mc-2",
            type: ExerciseType.MULTIPLE_CHOICE,
            question: "Was macht print()?",
            options: ["Text anzeigen", "Eine Farbe malen", "Eine Datei löschen", "Den Computer ausschalten"],
            correctAnswer: "Text anzeigen",
            hint: "print() ist wie ein Sprachknopf für den Computer.",
            xpReward: 10,
          },
          {
            id: "exercise-python-hallo-mc-3",
            type: ExerciseType.MULTIPLE_CHOICE,
            question: "Warum stehen Worte oft in Anführungszeichen?",
            options: ["Damit Python sie als Text erkennt", "Damit sie schneller laufen", "Damit sie unsichtbar sind", "Damit Zahlen entstehen"],
            correctAnswer: "Damit Python sie als Text erkennt",
            hint: "Ohne Anführungszeichen denkt Python, dass ein Name oder Befehl gemeint ist.",
            xpReward: 10,
          },
          {
            id: "exercise-python-hallo-gap-1",
            type: ExerciseType.CODE_GAP,
            question: "Fülle die Lücke, damit Python dein Wort sagt.",
            options: null,
            correctAnswer: "Hallo",
            hint: 'Schreibe ein Wort zwischen die Anführungszeichen: print("Hallo").',
            xpReward: 15,
          },
        ],
      },
      {
        id: "lesson-python-variablen",
        title: "Variablen sind Boxen",
        language: "python",
        theory:
          'Eine Variable ist wie eine beschriftete Box. In name = "Mia" liegt der Text Mia in der Box name. Danach kann Python diese Box immer wieder benutzen. So entsteht aus einzelnen Befehlen ein kleines Programm mit Gedächtnis.',
        order: 2,
        exercises: [
          {
            id: "exercise-python-variablen-mc-1",
            type: ExerciseType.MULTIPLE_CHOICE,
            question: "Welche Zeile speichert den Namen Max?",
            options: ['name = "Max"', '"Max" = name', "name == Max", "save name Max"],
            correctAnswer: 'name = "Max"',
            hint: "Links steht der Name der Box, rechts der Inhalt.",
            xpReward: 10,
          },
          {
            id: "exercise-python-variablen-mc-2",
            type: ExerciseType.MULTIPLE_CHOICE,
            question: 'Was zeigt print("Hallo " + name), wenn name = "Mia" ist?',
            options: ["Hallo Mia", "Hallo name", "Mia Hallo", "Fehler"],
            correctAnswer: "Hallo Mia",
            hint: "Python setzt die beiden Texte zusammen.",
            xpReward: 10,
          },
          {
            id: "exercise-python-variablen-mc-3",
            type: ExerciseType.MULTIPLE_CHOICE,
            question: "Welche Vorstellung passt gut zu einer Variable?",
            options: ["Eine Box mit Etikett", "Ein geschlossener Browser", "Ein Bild ohne Namen", "Ein fertiges Spiel"],
            correctAnswer: "Eine Box mit Etikett",
            hint: "Der Variablenname ist das Etikett, der Wert ist der Inhalt.",
            xpReward: 10,
          },
          {
            id: "exercise-python-variablen-gap-1",
            type: ExerciseType.CODE_GAP,
            question: "Setze einen Namen in die Variable ein.",
            options: null,
            correctAnswer: "Mia",
            hint: 'Der Name ist Text und braucht Anführungszeichen: name = "Mia".',
            xpReward: 15,
          },
        ],
      },
      {
        id: "lesson-python-rechnen",
        title: "Rechnen mit Python",
        language: "python",
        theory:
          "Python kann Zahlen wie ein Taschenrechner verwenden. Der wichtige Lernschritt ist: Zahlen bleiben Zahlen, Text bleibt Text. Mit Variablen wie punkte = 10 kann ein Programm Ergebnisse merken und weiterrechnen.",
        order: 3,
        exercises: [
          {
            id: "exercise-python-rechnen-mc-1",
            type: ExerciseType.MULTIPLE_CHOICE,
            question: "Was ergibt 2 + 3 in Python?",
            options: ["5", "23", "2+3", "6"],
            correctAnswer: "5",
            hint: "Python rechnet die beiden Zahlen zusammen.",
            xpReward: 10,
          },
          {
            id: "exercise-python-rechnen-mc-2",
            type: ExerciseType.MULTIPLE_CHOICE,
            question: "Welche Zeile speichert Punkte richtig?",
            options: ["punkte = 10 + 5", "10 + 5 = punkte", "punkte :=:", "punkte ist 15"],
            correctAnswer: "punkte = 10 + 5",
            hint: "Eine Variable bekommt mit einem einfachen = ihren Wert.",
            xpReward: 10,
          },
          {
            id: "exercise-python-rechnen-mc-3",
            type: ExerciseType.MULTIPLE_CHOICE,
            question: "Was zeigt print(4 * 2)?",
            options: ["8", "42", "4 * 2", "6"],
            correctAnswer: "8",
            hint: "Der Stern ist in Python das Zeichen für Malnehmen.",
            xpReward: 10,
          },
          {
            id: "exercise-python-rechnen-free-1",
            type: ExerciseType.FREE_CODE,
            question: "Schreibe Code, der dein Alter im nächsten Jahr ausgibt.",
            options: null,
            correctAnswer: "7",
            hint: "Speichere dein Alter in einer Variable und rechne plus 1.",
            xpReward: 20,
          },
        ],
      },
      {
        id: "lesson-python-if",
        title: "Entscheidungen mit if",
        language: "python",
        theory:
          "Programme werden spannend, wenn sie entscheiden können. Mit if fragt Python: Stimmt diese Bedingung? Wenn ja, läuft der eingerückte Code darunter. Wenn nein, kann else eine andere Antwort geben. So entsteht eine einfache Wenn-dann-Regel.",
        order: 4,
        exercises: [
          {
            id: "exercise-python-if-mc-1",
            type: ExerciseType.MULTIPLE_CHOICE,
            question: "Welches Wort startet eine Entscheidung in Python?",
            options: ["if", "maybe", "check", "when"],
            correctAnswer: "if",
            hint: "if bedeutet: wenn etwas stimmt, dann führe den Code aus.",
            xpReward: 10,
          },
          {
            id: "exercise-python-if-mc-2",
            type: ExerciseType.MULTIPLE_CHOICE,
            question: "Was macht else?",
            options: ["Es läuft, wenn die if-Bedingung nicht stimmt", "Es beendet immer Python", "Es macht Text blau", "Es speichert eine Liste"],
            correctAnswer: "Es läuft, wenn die if-Bedingung nicht stimmt",
            hint: "else ist der andere Weg.",
            xpReward: 10,
          },
          {
            id: "exercise-python-if-mc-3",
            type: ExerciseType.MULTIPLE_CHOICE,
            question: "Warum ist Einrückung bei if wichtig?",
            options: ["Sie zeigt, welcher Code zur Entscheidung gehört", "Sie macht den Code geheim", "Sie ist nur Schmuck", "Sie ersetzt Anführungszeichen"],
            correctAnswer: "Sie zeigt, welcher Code zur Entscheidung gehört",
            hint: "Python liest Einrückungen als Struktur.",
            xpReward: 10,
          },
          {
            id: "exercise-python-if-gap-1",
            type: ExerciseType.CODE_GAP,
            question: "Fülle den Namen ein, damit die besondere Begrüßung erscheint.",
            options: null,
            correctAnswer: "Hallo Max",
            hint: 'Setze Max in die Variable: name = "Max".',
            xpReward: 15,
          },
        ],
      },
      {
        id: "lesson-python-fehler-finden",
        title: "Fehler finden",
        language: "python",
        theory:
          "Fehler sind Hinweise, keine Niederlagen. Gute Programmiererinnen und Programmierer lesen genau: Fehlt ein Anführungszeichen? Ist ein Name anders geschrieben? Der Kurs arbeitet fehlerfreundlich: ausprobieren, Ausgabe anschauen, kleine Änderung machen.",
        order: 5,
        exercises: [
          {
            id: "exercise-python-fehler-mc-1",
            type: ExerciseType.MULTIPLE_CHOICE,
            question: 'Was ist an print("Hallo) falsch?',
            options: ["Ein Anführungszeichen fehlt", "print darf nicht benutzt werden", "Hallo ist zu kurz", "Python kann keinen Text"],
            correctAnswer: "Ein Anführungszeichen fehlt",
            hint: "Text braucht vorne und hinten ein Anführungszeichen.",
            xpReward: 10,
          },
          {
            id: "exercise-python-fehler-mc-2",
            type: ExerciseType.MULTIPLE_CHOICE,
            question: "Was hilft beim Debuggen?",
            options: ["Eine kleine Stelle nach der anderen prüfen", "Alles auf einmal löschen", "Nie die Ausgabe lesen", "Nur raten"],
            correctAnswer: "Eine kleine Stelle nach der anderen prüfen",
            hint: "Kleine Tests machen Fehler leichter sichtbar.",
            xpReward: 10,
          },
          {
            id: "exercise-python-fehler-mc-3",
            type: ExerciseType.MULTIPLE_CHOICE,
            question: "Was bedeutet eine Fehlermeldung am besten?",
            options: ["Python gibt einen Hinweis", "Das Projekt ist kaputt", "Man darf nicht weiterlernen", "Der Computer ist aus"],
            correctAnswer: "Python gibt einen Hinweis",
            hint: "Die Meldung zeigt oft, wo du anfangen kannst zu suchen.",
            xpReward: 10,
          },
          {
            id: "exercise-python-fehler-gap-1",
            type: ExerciseType.CODE_GAP,
            question: "Repariere den Text, damit Python Fertig ausgibt.",
            options: null,
            correctAnswer: "Fertig",
            hint: "In die Lücke gehört das Wort Fertig zwischen Anführungszeichen.",
            xpReward: 15,
          },
        ],
      },
    ],
  },
  {
    id: "course-beginner-html",
    title: "Beginner HTML",
    level: Level.BEGINNER,
    description: "Baue deine erste Webseite mit Überschriften, Texten, Links und Listen.",
    order: 2,
    lessons: [
      {
        id: "lesson-html-bausteine",
        title: "HTML-Bausteine",
        language: "html",
        theory:
          "HTML beschreibt, welche Teile eine Webseite hat. <h1> ist eine große Überschrift, <p> ist ein Textblock. Die meisten Tags haben einen Anfang und ein Ende. Dadurch erkennt der Browser die Struktur.",
        order: 1,
        exercises: [
          {
            id: "exercise-html-bausteine-mc-1",
            type: ExerciseType.MULTIPLE_CHOICE,
            question: "Welches HTML macht eine große Überschrift?",
            options: ["<h1>Hallo</h1>", "<p>Hallo</p>", "<button>Hallo</button>", "<list>Hallo</list>"],
            correctAnswer: "<h1>Hallo</h1>",
            hint: "h1 steht für die wichtigste Überschrift.",
            xpReward: 10,
          },
          {
            id: "exercise-html-bausteine-mc-2",
            type: ExerciseType.MULTIPLE_CHOICE,
            question: "Welches Tag macht einen Absatz?",
            options: ["<p>Text</p>", "<h1>Text</h1>", "<img>Text</img>", "<page>Text</page>"],
            correctAnswer: "<p>Text</p>",
            hint: "p steht für paragraph, also Absatz.",
            xpReward: 10,
          },
          {
            id: "exercise-html-bausteine-mc-3",
            type: ExerciseType.MULTIPLE_CHOICE,
            question: "Warum werden viele HTML-Tags geschlossen?",
            options: ["Damit der Browser weiß, wo ein Teil endet", "Damit Python schneller läuft", "Damit die Seite offline ist", "Damit der Text verschwindet"],
            correctAnswer: "Damit der Browser weiß, wo ein Teil endet",
            hint: "Ein Start-Tag und ein Ende-Tag bilden zusammen einen Baustein.",
            xpReward: 10,
          },
          {
            id: "exercise-html-bausteine-gap-1",
            type: ExerciseType.CODE_GAP,
            question: "Ergänze die Überschrift deiner Webseite.",
            options: null,
            correctAnswer: "Meine Homepage",
            hint: "Der Text steht zwischen <h1> und </h1>.",
            xpReward: 15,
          },
        ],
      },
      {
        id: "lesson-html-text-und-links",
        title: "Text und Links",
        language: "html",
        theory:
          "Eine Webseite ist mehr als eine Überschrift. Absätze erklären deine Idee, Links verbinden deine Seite mit anderen Orten. Ein Link benutzt das a-Tag und die Adresse steht im href-Attribut.",
        order: 2,
        exercises: [
          {
            id: "exercise-html-links-mc-1",
            type: ExerciseType.MULTIPLE_CHOICE,
            question: "Welcher Code ist ein Link?",
            options: ['<a href="https://example.com">Klick</a>', "<link>Klick</link>", "<p href>Klick</p>", "<url>Klick</url>"],
            correctAnswer: '<a href="https://example.com">Klick</a>',
            hint: "Links benutzen das a-Tag.",
            xpReward: 10,
          },
          {
            id: "exercise-html-links-mc-2",
            type: ExerciseType.MULTIPLE_CHOICE,
            question: "Wo steht die Zieladresse eines Links?",
            options: ["Im href-Attribut", "Im p-Tag", "In einer Python-Variable", "Immer im Titel"],
            correctAnswer: "Im href-Attribut",
            hint: "href sagt dem Browser, wohin der Link führt.",
            xpReward: 10,
          },
          {
            id: "exercise-html-links-mc-3",
            type: ExerciseType.MULTIPLE_CHOICE,
            question: "Was ist guter Linktext?",
            options: ["Ein kurzer Text, der das Ziel beschreibt", "Nur leere Zeichen", "Immer das Wort Ding", "Ein Python-Befehl"],
            correctAnswer: "Ein kurzer Text, der das Ziel beschreibt",
            hint: "Kinder und Browser verstehen Links besser, wenn der Text klar ist.",
            xpReward: 10,
          },
          {
            id: "exercise-html-links-free-1",
            type: ExerciseType.FREE_CODE,
            question: "Schreibe einen Absatz über dein Lieblingstier.",
            options: null,
            correctAnswer: "<p>",
            hint: "Ein Absatz beginnt mit <p> und endet mit </p>.",
            xpReward: 20,
          },
        ],
      },
      {
        id: "lesson-html-listen",
        title: "Listen bauen",
        language: "html",
        theory:
          "Listen helfen, Dinge geordnet zu sammeln. <ul> ist eine ungeordnete Liste, jedes <li> ist ein einzelner Punkt. So kann eine Webseite Lieblingsspiele, Zutaten oder Lernziele sauber anzeigen.",
        order: 3,
        exercises: [
          {
            id: "exercise-html-listen-mc-1",
            type: ExerciseType.MULTIPLE_CHOICE,
            question: "Welches Tag ist ein Listenpunkt?",
            options: ["<li>", "<ul>", "<h1>", "<p>"],
            correctAnswer: "<li>",
            hint: "li steht für list item.",
            xpReward: 10,
          },
          {
            id: "exercise-html-listen-mc-2",
            type: ExerciseType.MULTIPLE_CHOICE,
            question: "Welche Liste ist richtig geschlossen?",
            options: ["<ul><li>Apfel</li></ul>", "<ul><li>Apfel</ul></li>", "<li><ul>Apfel</ul></li>", "<list>Apfel</list>"],
            correctAnswer: "<ul><li>Apfel</li></ul>",
            hint: "Der Listenpunkt liegt in der Liste.",
            xpReward: 10,
          },
          {
            id: "exercise-html-listen-mc-3",
            type: ExerciseType.MULTIPLE_CHOICE,
            question: "Wofür eignet sich eine Liste?",
            options: ["Mehrere Dinge untereinander anzeigen", "Python-Code ausführen", "Einen Server starten", "Den Bildschirm ausschalten"],
            correctAnswer: "Mehrere Dinge untereinander anzeigen",
            hint: "Listen ordnen mehrere kurze Einträge.",
            xpReward: 10,
          },
          {
            id: "exercise-html-listen-gap-1",
            type: ExerciseType.CODE_GAP,
            question: "Ergänze einen Listenpunkt für deine Webseite.",
            options: null,
            correctAnswer: "<li>",
            hint: "Ein Listenpunkt startet mit <li>.",
            xpReward: 15,
          },
        ],
      },
    ],
  },
  {
    id: "course-intermediate-core",
    title: "Intermediate Programmierwerkstatt",
    level: Level.INTERMEDIATE,
    description: "Schleifen, Funktionen, Listen, CSS und erste JavaScript-Interaktionen.",
    order: 1,
    lessons: [
      {
        id: "lesson-intermediate-schleifen",
        title: "Schleifen wiederholen Arbeit",
        language: "python",
        theory:
          "Schleifen sind für wiederholte Aufgaben da. Statt denselben Befehl fünfmal zu schreiben, beschreibt eine for-Schleife das Muster. Das passt zum Spiralcurriculum: bekannte print-Befehle werden wieder aufgegriffen und mit Wiederholung erweitert.",
        order: 1,
        exercises: [
          {
            id: "exercise-intermediate-schleifen-mc-1",
            type: ExerciseType.MULTIPLE_CHOICE,
            question: "Wofür ist eine Schleife gut?",
            options: ["Befehle wiederholen", "Text unsichtbar machen", "Eine Webseite löschen", "Variablen verbieten"],
            correctAnswer: "Befehle wiederholen",
            hint: "Eine Schleife spart Wiederholarbeit.",
            xpReward: 15,
          },
          {
            id: "exercise-intermediate-schleifen-mc-2",
            type: ExerciseType.MULTIPLE_CHOICE,
            question: "Wie oft läuft for i in range(3)?",
            options: ["3-mal", "2-mal", "4-mal", "Unendlich oft"],
            correctAnswer: "3-mal",
            hint: "range(3) gibt drei Schritte: 0, 1 und 2.",
            xpReward: 15,
          },
          {
            id: "exercise-intermediate-schleifen-gap-1",
            type: ExerciseType.CODE_GAP,
            question: "Lass die Rakete viermal starten.",
            options: null,
            correctAnswer: "Rakete startet! Rakete startet! Rakete startet! Rakete startet!",
            hint: "Setze in range() die Anzahl der Wiederholungen ein.",
            xpReward: 20,
          },
          {
            id: "exercise-intermediate-schleifen-free-1",
            type: ExerciseType.FREE_CODE,
            question: "Schreibe eine Schleife, die dreimal Stern ausgibt.",
            options: null,
            correctAnswer: "Stern Stern Stern",
            hint: 'Nutze for i in range(3): und darunter eingerückt print("Stern").',
            xpReward: 25,
          },
        ],
      },
      {
        id: "lesson-intermediate-funktionen",
        title: "Funktionen sind Zauberkisten",
        language: "python",
        theory:
          "Eine Funktion bekommt einen Namen und kann später wieder aufgerufen werden. Das Kind lernt: Ich packe mehrere Befehle in eine kleine Kiste. Parameter sind Platzhalter, damit dieselbe Funktion mit verschiedenen Namen oder Zahlen arbeiten kann.",
        order: 2,
        exercises: [
          {
            id: "exercise-intermediate-funktionen-mc-1",
            type: ExerciseType.MULTIPLE_CHOICE,
            question: "Welches Wort startet eine Funktion in Python?",
            options: ["def", "fun", "make", "box"],
            correctAnswer: "def",
            hint: "def kürzt define ab: Wir definieren eine Funktion.",
            xpReward: 15,
          },
          {
            id: "exercise-intermediate-funktionen-mc-2",
            type: ExerciseType.MULTIPLE_CHOICE,
            question: "Was ist ein Parameter?",
            options: ["Ein Platzhalter für einen Wert", "Ein Fehler", "Ein HTML-Tag", "Ein Bild"],
            correctAnswer: "Ein Platzhalter für einen Wert",
            hint: "Der Parameter steht in den Klammern der Funktion.",
            xpReward: 15,
          },
          {
            id: "exercise-intermediate-funktionen-gap-1",
            type: ExerciseType.CODE_GAP,
            question: "Rufe die Funktion mit Byte auf.",
            options: null,
            correctAnswer: "Hallo Byte",
            hint: 'Setze den Namen Byte als Text in die Klammern: begruessen("Byte").',
            xpReward: 20,
          },
          {
            id: "exercise-intermediate-funktionen-free-1",
            type: ExerciseType.FREE_CODE,
            question: "Schreibe eine Funktion, die 6 ausgibt.",
            options: null,
            correctAnswer: "6",
            hint: "Eine Funktion kann rechnen und mit print() das Ergebnis zeigen.",
            xpReward: 25,
          },
        ],
      },
      {
        id: "lesson-intermediate-listen",
        title: "Listen speichern viele Dinge",
        language: "python",
        theory:
          "Listen sind Reihen von Werten. Sie passen zu echten Kinderwelten: Farben, Tiere, Level, Punkte. Mit einem Index holt Python einen Eintrag heraus. Wichtig: Der erste Platz hat die Nummer 0.",
        order: 3,
        exercises: [
          {
            id: "exercise-intermediate-listen-mc-1",
            type: ExerciseType.MULTIPLE_CHOICE,
            question: "Welche Schreibweise ist eine Python-Liste?",
            options: ['["rot", "blau"]', '{"rot", "blau"}', "<rot, blau>", 'list = "rot"'],
            correctAnswer: '["rot", "blau"]',
            hint: "Listen benutzen eckige Klammern.",
            xpReward: 15,
          },
          {
            id: "exercise-intermediate-listen-mc-2",
            type: ExerciseType.MULTIPLE_CHOICE,
            question: "Welcher Index holt den ersten Eintrag?",
            options: ["0", "1", "first", "10"],
            correctAnswer: "0",
            hint: "Python zählt Listenplätze ab 0.",
            xpReward: 15,
          },
          {
            id: "exercise-intermediate-listen-gap-1",
            type: ExerciseType.CODE_GAP,
            question: "Hole grün aus der Liste.",
            options: null,
            correctAnswer: "grün",
            hint: "grün steht an Position 2, weil die Liste bei 0 startet.",
            xpReward: 20,
          },
          {
            id: "exercise-intermediate-listen-free-1",
            type: ExerciseType.FREE_CODE,
            question: "Erstelle eine Liste mit Tieren und gib Hund aus.",
            options: null,
            correctAnswer: "Hund",
            hint: "Lege eine Liste an und verwende print(tiere[...]).",
            xpReward: 25,
          },
        ],
      },
      {
        id: "lesson-intermediate-css",
        title: "CSS macht Webseiten bunt",
        language: "html",
        theory:
          "HTML beschreibt die Bausteine, CSS gestaltet sie. Farbe, Abstand und Schrift helfen Kindern, Wirkung direkt zu sehen. Eine einfache Regel wie h1 { color: purple; } sagt: Alle h1-Überschriften werden lila.",
        order: 4,
        exercises: [
          {
            id: "exercise-intermediate-css-mc-1",
            type: ExerciseType.MULTIPLE_CHOICE,
            question: "Wofür ist CSS da?",
            options: ["Webseiten gestalten", "Python ausführen", "Datenbank löschen", "Bilder fotografieren"],
            correctAnswer: "Webseiten gestalten",
            hint: "CSS kümmert sich um Aussehen: Farbe, Abstand, Größe.",
            xpReward: 15,
          },
          {
            id: "exercise-intermediate-css-mc-2",
            type: ExerciseType.MULTIPLE_CHOICE,
            question: "Welche CSS-Regel macht Text lila?",
            options: ["color: purple;", "text = purple", "<purple>", "paint purple"],
            correctAnswer: "color: purple;",
            hint: "Die Eigenschaft heißt color.",
            xpReward: 15,
          },
          {
            id: "exercise-intermediate-css-gap-1",
            type: ExerciseType.CODE_GAP,
            question: "Färbe die Überschrift lila.",
            options: null,
            correctAnswer: "purple",
            hint: "Setze purple hinter color: ein.",
            xpReward: 20,
          },
          {
            id: "exercise-intermediate-css-free-1",
            type: ExerciseType.FREE_CODE,
            question: "Baue eine kleine Karte mit Überschrift und Hintergrundfarbe.",
            options: null,
            correctAnswer: "background",
            hint: "Nutze <style> und eine CSS-Regel mit background.",
            xpReward: 25,
          },
        ],
      },
      {
        id: "lesson-intermediate-js-intro",
        title: "JavaScript macht Seiten lebendig",
        language: "html",
        theory:
          "JavaScript reagiert auf Klicks und verändert Seiten. Für Kinder ist das ein starker Moment: Ein Button wird gedrückt und etwas passiert sofort. In KidsCode bleibt der Einstieg klein: ein Button, ein Textfeld, eine klare Reaktion.",
        order: 5,
        exercises: [
          {
            id: "exercise-intermediate-js-mc-1",
            type: ExerciseType.MULTIPLE_CHOICE,
            question: "Was kann JavaScript auf einer Webseite tun?",
            options: ["Auf Klicks reagieren", "Nur Überschriften bauen", "Python ersetzen", "Den Bildschirm reinigen"],
            correctAnswer: "Auf Klicks reagieren",
            hint: "JavaScript macht Webseiten interaktiv.",
            xpReward: 15,
          },
          {
            id: "exercise-intermediate-js-mc-2",
            type: ExerciseType.MULTIPLE_CHOICE,
            question: "Welches HTML-Element passt zu einem Klick?",
            options: ["<button>", "<h1>", "<style>", "<ul>"],
            correctAnswer: "<button>",
            hint: "Ein Button ist ein Knopf.",
            xpReward: 15,
          },
          {
            id: "exercise-intermediate-js-gap-1",
            type: ExerciseType.CODE_GAP,
            question: "Setze den Text ein, der nach dem Klick erscheinen soll.",
            options: null,
            correctAnswer: "Hallo Button",
            hint: "Der neue Text steht in Anführungszeichen im JavaScript-Code.",
            xpReward: 20,
          },
          {
            id: "exercise-intermediate-js-free-1",
            type: ExerciseType.FREE_CODE,
            question: "Baue einen Button, der einen Text auf der Seite verändert.",
            options: null,
            correctAnswer: "onclick",
            hint: "Nutze ein button-Element und onclick.",
            xpReward: 25,
          },
        ],
      },
    ],
  },
  {
    id: "course-expert-lab",
    title: "Expert Tech-Lab",
    level: Level.EXPERT,
    description: "C-Grundlagen, Objektorientierung in Python und ein eigenes Mini-Projekt.",
    order: 1,
    lessons: [
      {
        id: "lesson-expert-c-intro",
        title: "C-Intro: nah am Computer",
        language: "c",
        theory:
          "C ist eine ältere, sehr wichtige Programmiersprache. Sie ist nah am Computer und zeigt deutlicher, dass Programme aus Funktionen, Typen und genauen Zeichen bestehen. Kinder sollen nicht alles auswendig können, sondern Muster erkennen: main, printf, Semikolon, return.",
        order: 1,
        exercises: [
          {
            id: "exercise-expert-c-mc-1",
            type: ExerciseType.MULTIPLE_CHOICE,
            question: "Welche Funktion startet ein einfaches C-Programm meistens?",
            options: ["main()", "start()", "run()", "print()"],
            correctAnswer: "main()",
            hint: "main ist der Einstiegspunkt vieler C-Programme.",
            xpReward: 20,
          },
          {
            id: "exercise-expert-c-mc-2",
            type: ExerciseType.MULTIPLE_CHOICE,
            question: "Welcher Befehl gibt in C Text aus?",
            options: ["printf", "print", "console.log", "echoHTML"],
            correctAnswer: "printf",
            hint: "printf kommt aus der C-Standardbibliothek.",
            xpReward: 20,
          },
          {
            id: "exercise-expert-c-mc-3",
            type: ExerciseType.MULTIPLE_CHOICE,
            question: "Was beendet viele C-Zeilen?",
            options: ["Ein Semikolon ;", "Ein Punkt .", "Ein Doppelstern **", "Ein HTML-Tag"],
            correctAnswer: "Ein Semikolon ;",
            hint: "C ist bei Satzzeichen strenger als Python.",
            xpReward: 20,
          },
          {
            id: "exercise-expert-c-mc-4",
            type: ExerciseType.MULTIPLE_CHOICE,
            question: "Was bedeutet int vor main?",
            options: ["Die Funktion gibt eine ganze Zahl zurück", "Die Funktion ist eine Webseite", "Der Text wird lila", "Das Programm ist fertig"],
            correctAnswer: "Die Funktion gibt eine ganze Zahl zurück",
            hint: "int ist ein Typ für ganze Zahlen.",
            xpReward: 20,
          },
        ],
      },
      {
        id: "lesson-expert-python-oop",
        title: "OOP in Python: eigene Baupläne",
        language: "python",
        theory:
          "Objektorientierung hilft, Dinge aus der Welt als Code-Baupläne zu beschreiben. Eine Klasse ist der Bauplan, ein Objekt ist ein konkretes Ding daraus. So kann ein Spiel viele Figuren haben, die alle Name, Punkte und Verhalten besitzen.",
        order: 2,
        exercises: [
          {
            id: "exercise-expert-oop-mc-1",
            type: ExerciseType.MULTIPLE_CHOICE,
            question: "Was ist eine Klasse?",
            options: ["Ein Bauplan für Objekte", "Eine einzelne Zahl", "Ein HTML-Link", "Eine Fehlermeldung"],
            correctAnswer: "Ein Bauplan für Objekte",
            hint: "Aus einer Klasse können mehrere Objekte entstehen.",
            xpReward: 20,
          },
          {
            id: "exercise-expert-oop-mc-2",
            type: ExerciseType.MULTIPLE_CHOICE,
            question: "Was macht __init__ in vielen Python-Klassen?",
            options: ["Es bereitet ein neues Objekt vor", "Es löscht eine Liste", "Es startet HTML", "Es schließt den Browser"],
            correctAnswer: "Es bereitet ein neues Objekt vor",
            hint: "__init__ läuft, wenn ein neues Objekt gebaut wird.",
            xpReward: 20,
          },
          {
            id: "exercise-expert-oop-gap-1",
            type: ExerciseType.CODE_GAP,
            question: "Gib dem Objekt den Namen Byte.",
            options: null,
            correctAnswer: "Byte",
            hint: "Setze Byte als Text in den Konstruktor ein.",
            xpReward: 25,
          },
          {
            id: "exercise-expert-oop-free-1",
            type: ExerciseType.FREE_CODE,
            question: "Schreibe eine kleine Klasse, die Hallo Klasse ausgibt.",
            options: null,
            correctAnswer: "Hallo Klasse",
            hint: 'Eine Methode in einer Klasse kann print("Hallo Klasse") ausführen.',
            xpReward: 30,
          },
        ],
      },
      {
        id: "lesson-expert-mini-projekt",
        title: "Mini-Projekt: Idee planen und bauen",
        language: "html",
        theory:
          "Im Abschlussprojekt zählt nicht nur Syntax, sondern ein kleiner Produktgedanke: Was soll passieren? Welche Bausteine braucht die Seite? Welche Aktion prüft das Kind? Das Projekt kombiniert HTML-Struktur, Gestaltung und eine kleine Interaktion.",
        order: 3,
        exercises: [
          {
            id: "exercise-expert-projekt-mc-1",
            type: ExerciseType.MULTIPLE_CHOICE,
            question: "Was ist ein guter erster Schritt für ein Mini-Projekt?",
            options: ["Die Idee in kleine Teile zerlegen", "Sofort alles gleichzeitig bauen", "Keine Tests machen", "Nur die Farben aussuchen"],
            correctAnswer: "Die Idee in kleine Teile zerlegen",
            hint: "Kleine Schritte machen Projekte überschaubar.",
            xpReward: 20,
          },
          {
            id: "exercise-expert-projekt-mc-2",
            type: ExerciseType.MULTIPLE_CHOICE,
            question: "Welche Mischung passt zu einer interaktiven Webseite?",
            options: ["HTML, CSS und JavaScript", "Nur Semikolons", "Nur Python-Listen", "Nur Datenbanktabellen"],
            correctAnswer: "HTML, CSS und JavaScript",
            hint: "HTML baut, CSS gestaltet, JavaScript reagiert.",
            xpReward: 20,
          },
          {
            id: "exercise-expert-projekt-gap-1",
            type: ExerciseType.CODE_GAP,
            question: "Ergänze den Punkt, damit der Zähler steigt.",
            options: null,
            correctAnswer: "score = score + 1",
            hint: "Ein Zähler wird größer, indem du 1 addierst.",
            xpReward: 25,
          },
          {
            id: "exercise-expert-projekt-free-1",
            type: ExerciseType.FREE_CODE,
            question: "Baue eine kleine Projektseite mit Titel, Button und sichtbarem Ergebnis.",
            options: null,
            correctAnswer: "button",
            hint: "Ein Titel mit <h1>, ein <button> und ein sichtbarer Text reichen für den Anfang.",
            xpReward: 30,
          },
        ],
      },
    ],
  },
];

async function main() {
  // Vollständigkeit vor dem ersten Schreibzugriff prüfen.
  for (const course of courses) {
    if (!courseTranslations[course.id]) throw new Error(`Kursübersetzung fehlt: ${course.id}`);
    for (const lesson of course.lessons) {
      if (!lessonTranslations[lesson.id]) throw new Error(`Lektionsübersetzung fehlt: ${lesson.id}`);
      for (const exercise of lesson.exercises) {
        const translation = exerciseTranslations[exercise.id];
        if (!translation) throw new Error(`Übersetzung fehlt: ${exercise.id}`);
        for (const language of ["en", "fr"] as const) {
          const options = translation[`options_${language}`];
          if (options && options.length !== exercise.options?.length) throw new Error(`Antwortzuordnung fehlerhaft: ${exercise.id}`);
        }
      }
    }
  }
  for (const course of courses) {
    await prisma.course.upsert({
      where: { id: course.id },
      update: {
        ...courseTranslations[course.id],
        title: course.title,
        level: course.level,
        description: course.description,
        order: course.order,
      },
      create: {
        ...courseTranslations[course.id],
        id: course.id,
        title: course.title,
        level: course.level,
        description: course.description,
        order: course.order,
      },
    });

    for (const lesson of course.lessons) {
      await prisma.lesson.upsert({
        where: { id: lesson.id },
        update: {
          ...lessonTranslations[lesson.id],
          courseId: course.id,
          title: lesson.title,
          language: lesson.language,
          theory: lesson.theory,
          order: lesson.order,
        },
        create: {
          ...lessonTranslations[lesson.id],
          id: lesson.id,
          courseId: course.id,
          title: lesson.title,
          language: lesson.language,
          theory: lesson.theory,
          order: lesson.order,
        },
      });

      for (const exercise of lesson.exercises) {
        const options = exercise.options === null ? Prisma.JsonNull : exercise.options;
        const translated = exerciseTranslations[exercise.id];
        const translation = { ...translated, options_en: translated.options_en ?? options, options_fr: translated.options_fr ?? options };

        await prisma.exercise.upsert({
          where: { id: exercise.id },
          update: {
            ...translation,
            lessonId: lesson.id,
            type: exercise.type,
            question: exercise.question,
            options,
            correctAnswer: exercise.correctAnswer,
            hint: exercise.hint,
            xpReward: exercise.xpReward,
          },
          create: {
            ...translation,
            id: exercise.id,
            lessonId: lesson.id,
            type: exercise.type,
            question: exercise.question,
            options,
            correctAnswer: exercise.correctAnswer,
            hint: exercise.hint,
            xpReward: exercise.xpReward,
          },
        });
      }
    }
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });

import { prisma } from "../src/lib/prisma";
import { ExerciseType, Level, Prisma } from "@prisma/client";

const courses = [
  {
    id: "course-beginner-python",
    title: "Beginner Python",
    level: Level.BEGINNER,
    description: "Erste Befehle, Variablen und kleine Rechnungen mit Python.",
    order: 1,
    lessons: [
      {
        id: "lesson-python-hallo-welt",
        title: "Hallo Welt in Python",
        language: "python",
        theory:
          'Mit print() kann der Computer etwas sagen. Text steht in Anfuehrungszeichen, zum Beispiel print("Hallo!").',
        order: 1,
        exercises: [
          {
            id: "exercise-python-hallo-mc-1",
            type: ExerciseType.MULTIPLE_CHOICE,
            question: "Welche Zeile zeigt Hallo auf dem Bildschirm?",
            options: ['print("Hallo!")', "show Hallo", 'print(Hallo!")', "Hallo.print()"],
            correctAnswer: 'print("Hallo!")',
            hint: "Python benutzt print() und Text steht zwischen zwei Anfuehrungszeichen.",
            xpReward: 10,
          },
          {
            id: "exercise-python-hallo-mc-2",
            type: ExerciseType.MULTIPLE_CHOICE,
            question: "Was macht print()?",
            options: ["Text anzeigen", "Eine Farbe malen", "Eine Datei loeschen", "Den Computer ausschalten"],
            correctAnswer: "Text anzeigen",
            hint: "print() ist wie ein Sprachknopf fuer den Computer.",
            xpReward: 10,
          },
          {
            id: "exercise-python-hallo-gap-1",
            type: ExerciseType.CODE_GAP,
            question: "Fuellen die Luecke, damit Python dein Wort sagt.",
            options: null,
            correctAnswer: "Hallo",
            hint: 'Schreibe ein Wort zwischen die Anfuehrungszeichen: print("Hallo").',
            xpReward: 15,
          },
        ],
      },
      {
        id: "lesson-python-variablen",
        title: "Variablen sind Boxen",
        language: "python",
        theory:
          'Eine Variable ist wie eine beschriftete Box. In name = "Mia" liegt der Text Mia in der Box name.',
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
            id: "exercise-python-variablen-gap-1",
            type: ExerciseType.CODE_GAP,
            question: "Setze einen Namen in die Variable ein.",
            options: null,
            correctAnswer: "Mia",
            hint: 'Der Name ist Text und braucht Anfuehrungszeichen: name = "Mia".',
            xpReward: 15,
          },
        ],
      },
      {
        id: "lesson-python-rechnen",
        title: "Rechnen mit Python",
        language: "python",
        theory:
          "Python kann Zahlen schnell zusammenrechnen. Mit print(alter + 1) zeigt der Computer das Ergebnis.",
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
            id: "exercise-python-rechnen-free-1",
            type: ExerciseType.FREE_CODE,
            question: "Schreibe Code, der dein Alter im naechsten Jahr ausgibt.",
            options: null,
            correctAnswer: "7",
            hint: "Speichere dein Alter in einer Variable und rechne plus 1.",
            xpReward: 20,
          },
        ],
      },
    ],
  },
  {
    id: "course-beginner-html",
    title: "Beginner HTML",
    level: Level.BEGINNER,
    description: "Baue deine erste Webseite mit Ueberschriften, Texten und Listen.",
    order: 2,
    lessons: [
      {
        id: "lesson-html-bausteine",
        title: "HTML-Bausteine",
        language: "html",
        theory:
          "<h1> ist eine grosse Ueberschrift. <p> ist ein Textblock. Jedes Tag wird wieder geschlossen.",
        order: 1,
        exercises: [
          {
            id: "exercise-html-bausteine-mc-1",
            type: ExerciseType.MULTIPLE_CHOICE,
            question: "Welches HTML macht eine grosse Ueberschrift?",
            options: ["<h1>Hallo</h1>", "<p>Hallo</p>", "<button>Hallo</button>", "<list>Hallo</list>"],
            correctAnswer: "<h1>Hallo</h1>",
            hint: "h1 steht fuer die wichtigste Ueberschrift.",
            xpReward: 10,
          },
          {
            id: "exercise-html-bausteine-mc-2",
            type: ExerciseType.MULTIPLE_CHOICE,
            question: "Welches Tag macht einen Absatz?",
            options: ["<p>Text</p>", "<h1>Text</h1>", "<img>Text</img>", "<page>Text</page>"],
            correctAnswer: "<p>Text</p>",
            hint: "p steht fuer paragraph, also Absatz.",
            xpReward: 10,
          },
          {
            id: "exercise-html-bausteine-gap-1",
            type: ExerciseType.CODE_GAP,
            question: "Ergaenze die Ueberschrift deiner Webseite.",
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
          "Mit HTML kannst du Text strukturieren und Links setzen. Ein Link benutzt das a-Tag mit href.",
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
            hint: "href sagt dem Browser, wohin der Link fuehrt.",
            xpReward: 10,
          },
          {
            id: "exercise-html-links-free-1",
            type: ExerciseType.FREE_CODE,
            question: "Schreibe einen Absatz ueber dein Lieblingstier.",
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
          "Eine Liste sammelt mehrere Dinge. <ul> ist die Liste, jedes <li> ist ein einzelner Punkt.",
        order: 3,
        exercises: [
          {
            id: "exercise-html-listen-mc-1",
            type: ExerciseType.MULTIPLE_CHOICE,
            question: "Welches Tag ist ein Listenpunkt?",
            options: ["<li>", "<ul>", "<h1>", "<p>"],
            correctAnswer: "<li>",
            hint: "li steht fuer list item.",
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
            id: "exercise-html-listen-gap-1",
            type: ExerciseType.CODE_GAP,
            question: "Ergaenze einen Listenpunkt fuer deine Webseite.",
            options: null,
            correctAnswer: "<li>",
            hint: "Ein Listenpunkt startet mit <li>.",
            xpReward: 15,
          },
        ],
      },
    ],
  },
];

async function main() {
  for (const course of courses) {
    await prisma.course.upsert({
      where: { id: course.id },
      update: {
        title: course.title,
        level: course.level,
        description: course.description,
        order: course.order,
      },
      create: {
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
          courseId: course.id,
          title: lesson.title,
          language: lesson.language,
          theory: lesson.theory,
          order: lesson.order,
        },
        create: {
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

        await prisma.exercise.upsert({
          where: { id: exercise.id },
          update: {
            lessonId: lesson.id,
            type: exercise.type,
            question: exercise.question,
            options,
            correctAnswer: exercise.correctAnswer,
            hint: exercise.hint,
            xpReward: exercise.xpReward,
          },
          create: {
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

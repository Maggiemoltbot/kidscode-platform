import { prisma } from "@/lib/prisma";
import { levelConfigs, type LevelSlug } from "@/lib/level-config";
import { translatedFields, type LocalizedFields } from "@/lib/localization";

export type LessonExerciseData = LocalizedFields & {
  id: string;
  type: string;
  question: string;
  hint: string;
  xpReward: number;
  order: number;
};

export type LessonDetailData = LocalizedFields & {
  id: string;
  title: string;
  language: string;
  theory: string;
  order: number;
  course: LocalizedFields & {
    id: string;
    title: string;
  };
  exercises: LessonExerciseData[];
  sampleCode: string;
  mascotMessage: string;
};

export type ExercisePreviewData = LessonExerciseData & {
  options: string[];
  options_en: string[];
  options_fr: string[];
  starterCode: string;
  totalExercises: number;
  lesson: LocalizedFields & {
    id: string;
    title: string;
    language: string;
    course: LocalizedFields & {
      title: string;
    };
  };
  orderedExerciseIds: string[];
};

const sampleCodeByLesson: Record<string, string> = {
  "lesson-python-hallo-welt": 'print("Hallo!")',
  "lesson-python-variablen": 'name = "Mia"\nprint("Hallo " + name)',
  "lesson-python-rechnen": "alter = 6\nprint(alter + 1)",
  "lesson-python-if":
    'name = "Max"\nif name == "Max":\n    print("Hallo Max")\nelse:\n    print("Hallo Freund")',
  "lesson-python-fehler-finden": 'print("Fertig")',
  "lesson-html-bausteine": "<h1>Hallo Welt</h1>\n<p>Das ist meine erste Webseite.</p>",
  "lesson-html-text-und-links":
    '<p>Ich mag Roboter.</p>\n<a href="https://example.com">Mein Link</a>',
  "lesson-html-listen": "<ul>\n  <li>Apfel</li>\n  <li>Banane</li>\n</ul>",
  "lesson-intermediate-schleifen": 'for i in range(4):\n    print("Rakete startet!")',
  "lesson-intermediate-funktionen":
    'def begruessen(name):\n    print("Hallo " + name)\n\nbegruessen("Byte")',
  "lesson-intermediate-listen": 'farben = ["rot", "blau", "grün"]\nprint(farben[2])',
  "lesson-intermediate-css":
    "<style>\n  h1 { color: purple; }\n  .karte { background: orange; padding: 16px; }\n</style>\n<h1>Meine Seite</h1>\n<div class=\"karte\">Hallo!</div>",
  "lesson-intermediate-js-intro":
    "<button onclick=\"document.getElementById('text').textContent='Hallo Button'\">Klick</button>\n<p id=\"text\">Warte...</p>",
  "lesson-expert-c-intro": '#include <stdio.h>\n\nint main() {\n  printf("Hallo C!");\n  return 0;\n}',
  "lesson-expert-python-oop":
    'class Figur:\n    def __init__(self, name):\n        self.name = name\n\nfigur = Figur("Byte")\nprint(figur.name)',
  "lesson-expert-mini-projekt":
    "<h1>Punkte-Spiel</h1>\n<button onclick=\"score = score + 1; document.getElementById('score').textContent = score\">Punkt</button>\n<p id=\"score\">0</p>\n<script>let score = 0;</script>",
};

const exerciseTypeOrder: Record<string, number> = {
  MULTIPLE_CHOICE: 1,
  CODE_GAP: 2,
  FREE_CODE: 3,
};

const starterCodeByExercise: Record<string, string> = {
  "exercise-python-hallo-gap-1": 'print("____")',
  "exercise-python-variablen-gap-1": 'name = "____"\nprint("Hallo " + name)',
  "exercise-python-rechnen-free-1": "alter = 6\nprint(alter + 1)",
  "exercise-python-if-gap-1":
    'name = "____"\nif name == "Max":\n    print("Hallo Max")\nelse:\n    print("Hallo Freund")',
  "exercise-python-fehler-gap-1": 'print("____")',
  "exercise-html-bausteine-gap-1": "<h1>____</h1>\n<p>Meine erste Webseite</p>",
  "exercise-html-links-free-1": "<p>Mein Lieblingstier ist ...</p>",
  "exercise-html-listen-gap-1": "<ul>\n  ____Apfel</li>\n</ul>",
  "exercise-intermediate-schleifen-gap-1": 'for i in range(____):\n    print("Rakete startet!")',
  "exercise-intermediate-schleifen-free-1": 'for i in range(3):\n    print("Stern")',
  "exercise-intermediate-funktionen-gap-1":
    'def begruessen(name):\n    print("Hallo " + name)\n\nbegruessen("____")',
  "exercise-intermediate-funktionen-free-1": "def zeige_zahl():\n    print(3 + 3)\n\nzeige_zahl()",
  "exercise-intermediate-listen-gap-1": 'farben = ["rot", "blau", "grün"]\nprint(farben[____])',
  "exercise-intermediate-listen-free-1": 'tiere = ["Katze", "Hund", "Fisch"]\nprint(tiere[1])',
  "exercise-intermediate-css-gap-1":
    "<style>\n  h1 { color: ____; }\n</style>\n<h1>Meine Seite</h1>",
  "exercise-intermediate-css-free-1":
    "<style>\n  .karte {\n    background: orange;\n    padding: 16px;\n  }\n</style>\n<div class=\"karte\">\n  <h1>Meine Karte</h1>\n</div>",
  "exercise-intermediate-js-gap-1":
    "<button onclick=\"document.getElementById('text').textContent='____'\">Klick</button>\n<p id=\"text\">Warte...</p>",
  "exercise-intermediate-js-free-1":
    "<button onclick=\"document.getElementById('text').textContent='Geschafft!'\">Klick</button>\n<p id=\"text\">Warte...</p>",
  "exercise-expert-oop-gap-1":
    "class Figur:\n    def __init__(self, name):\n        self.name = name\n\nfigur = Figur(\"____\")\nprint(figur.name)",
  "exercise-expert-oop-free-1":
    'class Nachricht:\n    def sagen(self):\n        print("Hallo Klasse")\n\nnachricht = Nachricht()\nnachricht.sagen()',
  "exercise-expert-projekt-gap-1":
    "<h1>Punkte-Spiel</h1>\n<button onclick=\"____; document.getElementById('score').textContent = score\">Punkt</button>\n<p id=\"score\">0</p>\n<script>let score = 0;</script>",
  "exercise-expert-projekt-free-1":
    "<h1>Mein Mini-Projekt</h1>\n<button onclick=\"document.getElementById('status').textContent='Fertig!'\">Start</button>\n<p id=\"status\">Noch nicht gestartet</p>",
};

export function sortLessonExercises<T extends { id: string; type: string }>(exercises: T[]) {
  return [...exercises].sort((a, b) => {
    const typeDiff = (exerciseTypeOrder[a.type] ?? 99) - (exerciseTypeOrder[b.type] ?? 99);

    if (typeDiff !== 0) {
      return typeDiff;
    }

    return a.id.localeCompare(b.id);
  });
}

function parseOptions(options: unknown) {
  if (!Array.isArray(options)) {
    return [];
  }

  return options.filter((option): option is string => typeof option === "string");
}

function getDefaultSample(language: string) {
  if (language.toLowerCase() === "html") {
    return "<h1>Meine Idee</h1>\n<p>Hier steht dein Text.</p>";
  }

  if (language.toLowerCase() === "c") {
    return '#include <stdio.h>\n\nint main() {\n  printf("Meine Idee");\n  return 0;\n}';
  }

  return 'print("Meine Idee")';
}

function getStarterCode(exerciseId: string, exerciseType: string, language: string) {
  const starterCode = starterCodeByExercise[exerciseId];

  if (starterCode !== undefined) {
    return starterCode;
  }

  if (exerciseType === "FREE_CODE") {
    return "";
  }

  if (language.toLowerCase() === "html") {
    return "<h1>____</h1>\n<p>Hier steht dein Text.</p>";
  }

  return 'print("____")';
}

function getMascotMessage(language: string, title: string) {
  if (language.toLowerCase() === "html") {
    return `${title} ist wie Bauen mit kleinen Schildchen. Jedes Tag sagt dem Browser, was ein Teil deiner Seite sein soll.`;
  }

  if (language.toLowerCase() === "c") {
    return `${title} zeigt Code ganz nah am Computer. Achte besonders auf Klammern, Semikolons und klare Reihenfolge.`;
  }

  return `${title} ist ein kleiner Befehl für den Computer. Lies den Code laut, dann erkennst du oft schon, was passiert.`;
}

export async function getLessonByLevel(levelSlug: LevelSlug, lessonId: string): Promise<LessonDetailData | null> {
  const level = levelConfigs[levelSlug];
  const lesson = await prisma.lesson.findFirst({
    where: {
      id: lessonId,
      course: {
        level: level.dbLevel,
      },
    },
    include: {
      course: true,
      exercises: true,
    },
  });

  if (!lesson) {
    return null;
  }

  return {
    ...translatedFields(lesson),
    id: lesson.id,
    title: lesson.title,
    language: lesson.language,
    theory: lesson.theory,
    order: lesson.order,
    course: {
      ...translatedFields(lesson.course),
      id: lesson.course.id,
      title: lesson.course.title,
    },
    exercises: sortLessonExercises(lesson.exercises).map((exercise, index) => ({
      ...translatedFields(exercise),
      id: exercise.id,
      type: exercise.type,
      question: exercise.question,
      hint: exercise.hint,
      xpReward: exercise.xpReward,
      order: index + 1,
    })),
    sampleCode: sampleCodeByLesson[lesson.id] ?? getDefaultSample(lesson.language),
    mascotMessage: getMascotMessage(lesson.language, lesson.title),
  };
}

export async function getExercisePreviewByLevel(
  levelSlug: LevelSlug,
  lessonId: string,
  exerciseId: string
): Promise<ExercisePreviewData | null> {
  const level = levelConfigs[levelSlug];
  const exercise = await prisma.exercise.findFirst({
    where: {
      id: exerciseId,
      lessonId,
      lesson: {
        course: {
          level: level.dbLevel,
        },
      },
    },
    include: {
      lesson: {
        include: {
          course: true,
          exercises: true,
        },
      },
    },
  });

  if (!exercise) {
    return null;
  }

  const orderedExercises = sortLessonExercises(exercise.lesson.exercises);
  const exerciseOrder = orderedExercises.findIndex((lessonExercise) => lessonExercise.id === exercise.id) + 1;

  return {
    ...translatedFields(exercise),
    id: exercise.id,
    type: exercise.type,
    question: exercise.question,
    hint: exercise.hint,
    xpReward: exercise.xpReward,
    order: exerciseOrder,
    options: parseOptions(exercise.options),
    options_en: parseOptions(exercise.options_en),
    options_fr: parseOptions(exercise.options_fr),
    starterCode: getStarterCode(exercise.id, exercise.type, exercise.lesson.language),
    totalExercises: orderedExercises.length,
    lesson: {
      ...translatedFields(exercise.lesson),
      id: exercise.lesson.id,
      title: exercise.lesson.title,
      language: exercise.lesson.language,
      course: {
        ...translatedFields(exercise.lesson.course),
        title: exercise.lesson.course.title,
      },
    },
    orderedExerciseIds: orderedExercises.map((lessonExercise) => lessonExercise.id),
  };
}

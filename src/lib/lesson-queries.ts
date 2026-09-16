import { prisma } from "@/lib/prisma";
import { levelConfigs, type LevelSlug } from "@/lib/level-config";

export type LessonExerciseData = {
  id: string;
  type: string;
  question: string;
  hint: string;
  xpReward: number;
  order: number;
};

export type LessonDetailData = {
  id: string;
  title: string;
  language: string;
  theory: string;
  order: number;
  course: {
    id: string;
    title: string;
  };
  exercises: LessonExerciseData[];
  sampleCode: string;
  mascotMessage: string;
};

export type ExercisePreviewData = LessonExerciseData & {
  options: string[];
  totalExercises: number;
  lesson: {
    id: string;
    title: string;
    language: string;
    course: {
      title: string;
    };
  };
  orderedExerciseIds: string[];
};

const sampleCodeByLesson: Record<string, string> = {
  "lesson-python-hallo-welt": 'print("Hallo!")',
  "lesson-python-variablen": 'name = "Mia"\nprint("Hallo " + name)',
  "lesson-python-rechnen": "alter = 6\nprint(alter + 1)",
  "lesson-html-bausteine": "<h1>Hallo Welt</h1>\n<p>Das ist meine erste Webseite.</p>",
  "lesson-html-text-und-links":
    '<p>Ich mag Roboter.</p>\n<a href="https://example.com">Mein Link</a>',
  "lesson-html-listen": "<ul>\n  <li>Apfel</li>\n  <li>Banane</li>\n</ul>",
};

const exerciseTypeOrder: Record<string, number> = {
  MULTIPLE_CHOICE: 1,
  CODE_GAP: 2,
  FREE_CODE: 3,
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

  return 'print("Meine Idee")';
}

function getMascotMessage(language: string, title: string) {
  if (language.toLowerCase() === "html") {
    return `${title} ist wie Bauen mit kleinen Schildchen. Jedes Tag sagt dem Browser, was ein Teil deiner Seite sein soll.`;
  }

  return `${title} ist ein kleiner Befehl fuer den Computer. Lies den Code laut, dann erkennst du oft schon, was passiert.`;
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
    id: lesson.id,
    title: lesson.title,
    language: lesson.language,
    theory: lesson.theory,
    order: lesson.order,
    course: {
      id: lesson.course.id,
      title: lesson.course.title,
    },
    exercises: sortLessonExercises(lesson.exercises).map((exercise, index) => ({
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
    id: exercise.id,
    type: exercise.type,
    question: exercise.question,
    hint: exercise.hint,
    xpReward: exercise.xpReward,
    order: exerciseOrder,
    options: parseOptions(exercise.options),
    totalExercises: orderedExercises.length,
    lesson: {
      id: exercise.lesson.id,
      title: exercise.lesson.title,
      language: exercise.lesson.language,
      course: {
        title: exercise.lesson.course.title,
      },
    },
    orderedExerciseIds: orderedExercises.map((lessonExercise) => lessonExercise.id),
  };
}

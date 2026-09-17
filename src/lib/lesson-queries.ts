import { prisma } from "@/lib/prisma";
import { getAnnotatedSampleCode, getAnnotatedStarterCode } from "@/lib/lesson-code";
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
  conceptType: string | null;
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
    conceptType: lesson.conceptType,
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
    sampleCode: lesson.sampleCode ?? getAnnotatedSampleCode(lesson.id, lesson.language),
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
    starterCode: exercise.starterCode ?? getAnnotatedStarterCode(exercise.id, exercise.type, exercise.lesson.language),
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

export type BadgeDefinition = {
  name: string;
  icon: string;
};

type CourseLevel = "BEGINNER" | "INTERMEDIATE" | "EXPERT";
type ExerciseKind = "MULTIPLE_CHOICE" | "CODE_GAP" | "FREE_CODE";

type GamificationCourse = {
  id: string;
  level: CourseLevel;
  lessons: {
    id: string;
    language: string;
    exercises: {
      id: string;
      type: ExerciseKind;
    }[];
  }[];
};

type GamificationProgress = {
  exerciseId: string;
  completed: boolean;
  correct: boolean;
  attempts: number;
};

export type GamificationStats = {
  xp: number;
  streak: number;
  totalAttempts: number;
  completedExerciseCount: number;
  completedLessonCount: number;
  completedCourseCount: number;
  completedPythonExerciseCount: number;
  completedHtmlExerciseCount: number;
  completedCodeGapCount: number;
  completedFreeCodeCount: number;
  beginnerCompletedExercises: number;
  beginnerTotalExercises: number;
};

export const badgeDefinitions = [
  { name: "Erster Schritt", icon: "🌟" },
  { name: "Python Starter", icon: "⌨️" },
  { name: "HTML Baumeister", icon: "🧱" },
  { name: "Lücken-Profi", icon: "🧩" },
  { name: "Freier Denker", icon: "💡" },
  { name: "50 XP Club", icon: "🚀" },
  { name: "100 XP Club", icon: "🏆" },
  { name: "Dranbleiber", icon: "🔥" },
  { name: "Fehler-Forscher", icon: "🔍" },
  { name: "Beginner Champion", icon: "🎓" },
] as const satisfies readonly BadgeDefinition[];

const badgeRules: Record<(typeof badgeDefinitions)[number]["name"], (stats: GamificationStats) => boolean> = {
  "Erster Schritt": (stats) => stats.completedLessonCount >= 1,
  "Python Starter": (stats) => stats.completedPythonExerciseCount >= 1,
  "HTML Baumeister": (stats) => stats.completedHtmlExerciseCount >= 1,
  "Lücken-Profi": (stats) => stats.completedCodeGapCount >= 1,
  "Freier Denker": (stats) => stats.completedFreeCodeCount >= 1,
  "50 XP Club": (stats) => stats.xp >= 50,
  "100 XP Club": (stats) => stats.xp >= 100,
  Dranbleiber: (stats) => stats.streak >= 3,
  "Fehler-Forscher": (stats) => stats.totalAttempts >= 5,
  "Beginner Champion": (stats) =>
    stats.beginnerTotalExercises > 0 && stats.beginnerCompletedExercises >= stats.beginnerTotalExercises,
};

function getLocalDayIndex(date: Date) {
  return Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 86_400_000;
}

function getDayDifference(from: Date, to: Date) {
  return Math.floor(getLocalDayIndex(to) - getLocalDayIndex(from));
}

export function getVisibleStreak(streak: number, lastActiveAt: Date | null, now = new Date()) {
  if (!lastActiveAt) {
    return 0;
  }

  const dayDifference = getDayDifference(lastActiveAt, now);

  if (dayDifference <= 1) {
    return Math.max(streak, 0);
  }

  return 0;
}

export function getStreakAfterActivity(streak: number, lastActiveAt: Date | null, now = new Date()) {
  if (!lastActiveAt) {
    return 1;
  }

  const dayDifference = getDayDifference(lastActiveAt, now);

  if (dayDifference <= 0) {
    return Math.max(streak, 1);
  }

  if (dayDifference === 1) {
    return Math.max(streak, 0) + 1;
  }

  return 1;
}

export function buildGamificationStats({
  courses,
  progress,
  xp,
  streak,
}: {
  courses: GamificationCourse[];
  progress: GamificationProgress[];
  xp: number;
  streak: number;
}): GamificationStats {
  const completedExerciseIds = new Set(
    progress.filter((progressItem) => progressItem.completed).map((progressItem) => progressItem.exerciseId)
  );
  const exerciseById = new Map<string, { language: string; type: ExerciseKind; level: CourseLevel }>();

  let completedLessonCount = 0;
  let completedCourseCount = 0;
  let beginnerCompletedExercises = 0;
  let beginnerTotalExercises = 0;

  for (const course of courses) {
    const courseExerciseIds: string[] = [];

    for (const lesson of course.lessons) {
      const lessonExerciseIds = lesson.exercises.map((exercise) => exercise.id);
      courseExerciseIds.push(...lessonExerciseIds);

      for (const exercise of lesson.exercises) {
        exerciseById.set(exercise.id, {
          language: lesson.language.toLowerCase(),
          type: exercise.type,
          level: course.level,
        });
      }

      if (lessonExerciseIds.length > 0 && lessonExerciseIds.every((exerciseId) => completedExerciseIds.has(exerciseId))) {
        completedLessonCount += 1;
      }
    }

    if (course.level === "BEGINNER") {
      beginnerTotalExercises += courseExerciseIds.length;
      beginnerCompletedExercises += courseExerciseIds.filter((exerciseId) => completedExerciseIds.has(exerciseId)).length;
    }

    if (courseExerciseIds.length > 0 && courseExerciseIds.every((exerciseId) => completedExerciseIds.has(exerciseId))) {
      completedCourseCount += 1;
    }
  }

  const completedExercises = Array.from(completedExerciseIds)
    .map((exerciseId) => exerciseById.get(exerciseId))
    .filter((exercise): exercise is { language: string; type: ExerciseKind; level: CourseLevel } => Boolean(exercise));

  return {
    xp,
    streak,
    totalAttempts: progress.reduce((sum, progressItem) => sum + progressItem.attempts, 0),
    completedExerciseCount: completedExerciseIds.size,
    completedLessonCount,
    completedCourseCount,
    completedPythonExerciseCount: completedExercises.filter((exercise) => exercise.language === "python").length,
    completedHtmlExerciseCount: completedExercises.filter((exercise) => exercise.language === "html").length,
    completedCodeGapCount: completedExercises.filter((exercise) => exercise.type === "CODE_GAP").length,
    completedFreeCodeCount: completedExercises.filter((exercise) => exercise.type === "FREE_CODE").length,
    beginnerCompletedExercises,
    beginnerTotalExercises,
  };
}

export function getEligibleBadges(stats: GamificationStats): BadgeDefinition[] {
  return badgeDefinitions.filter((badge) => badgeRules[badge.name](stats));
}

export function getLevelUpState(stats: GamificationStats) {
  return {
    beginnerComplete:
      stats.beginnerTotalExercises > 0 && stats.beginnerCompletedExercises >= stats.beginnerTotalExercises,
  };
}

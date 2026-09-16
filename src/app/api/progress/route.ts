import { NextResponse } from "next/server";
import {
  buildGamificationStats,
  getEligibleBadges,
  getStreakAfterActivity,
  type BadgeDefinition,
} from "@/lib/gamification";
import { prisma } from "@/lib/prisma";
import { sortLessonExercises } from "@/lib/lesson-queries";

export const dynamic = "force-dynamic";

function normalizeCodeAnswer(value: string) {
  return value.replace(/\s+/g, " ").trim().toLowerCase();
}

function isExerciseAnswerCorrect(type: string, answer: string, correctAnswer: string) {
  if (type === "MULTIPLE_CHOICE") {
    return answer === correctAnswer;
  }

  if (answer.includes("____")) {
    return false;
  }

  return normalizeCodeAnswer(answer).includes(normalizeCodeAnswer(correctAnswer));
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as {
    userId?: unknown;
    exerciseId?: unknown;
    answer?: unknown;
  } | null;

  const userId = typeof body?.userId === "string" ? body.userId : "";
  const exerciseId = typeof body?.exerciseId === "string" ? body.exerciseId : "";
  const answer = typeof body?.answer === "string" ? body.answer : "";

  if (!userId || !exerciseId || !answer) {
    return NextResponse.json({ error: "Profil, Uebung oder Antwort fehlt." }, { status: 400 });
  }

  const [user, exercise] = await Promise.all([
    prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        streak: true,
        lastActiveAt: true,
      },
    }),
    prisma.exercise.findUnique({
      where: {
        id: exerciseId,
      },
      include: {
        lesson: {
          include: {
            exercises: true,
          },
        },
      },
    }),
  ]);

  if (!user) {
    return NextResponse.json({ error: "Profil nicht gefunden." }, { status: 404 });
  }

  if (!exercise) {
    return NextResponse.json({ error: "Uebung nicht gefunden." }, { status: 404 });
  }

  const isCorrect = isExerciseAnswerCorrect(exercise.type, answer, exercise.correctAnswer);
  const orderedExercises = sortLessonExercises(exercise.lesson.exercises);
  const lessonExerciseIds = orderedExercises.map((lessonExercise) => lessonExercise.id);
  const currentIndex = lessonExerciseIds.indexOf(exercise.id);
  const now = new Date();

  const result = await prisma.$transaction(async (tx) => {
    const nextStreak = getStreakAfterActivity(user.streak, user.lastActiveAt, now);
    const existingProgress = await tx.progress.findUnique({
      where: {
        userId_exerciseId: {
          userId,
          exerciseId,
        },
      },
    });

    const wasAlreadyCompleted = existingProgress?.completed ?? false;
    const completed = wasAlreadyCompleted || isCorrect;
    const xpEarned = isCorrect && !wasAlreadyCompleted ? exercise.xpReward : 0;

    const progress = await tx.progress.upsert({
      where: {
        userId_exerciseId: {
          userId,
          exerciseId,
        },
      },
      update: {
        attempts: {
          increment: 1,
        },
        correct: existingProgress?.correct || isCorrect,
        completed,
        completedAt: existingProgress?.completedAt ?? (isCorrect ? now : null),
      },
      create: {
        userId,
        exerciseId,
        attempts: 1,
        correct: isCorrect,
        completed: isCorrect,
        completedAt: isCorrect ? now : null,
      },
      select: {
        attempts: true,
        completed: true,
      },
    });

    const updatedUser = await tx.user.update({
      where: {
        id: userId,
      },
      data: {
        xp: xpEarned > 0 ? { increment: xpEarned } : undefined,
        streak: nextStreak,
        lastActiveAt: now,
      },
      select: {
        xp: true,
        streak: true,
      },
    });

    const completedProgress = await tx.progress.findMany({
      where: {
        userId,
        exerciseId: {
          in: lessonExerciseIds,
        },
        completed: true,
      },
      select: {
        exerciseId: true,
      },
    });

    const completedExerciseIds = new Set(completedProgress.map((item) => item.exerciseId));
    const lessonCompleted = lessonExerciseIds.every((id) => completedExerciseIds.has(id));
    const nextExercise =
      orderedExercises
        .slice(Math.max(currentIndex + 1, 0))
        .find((lessonExercise) => !completedExerciseIds.has(lessonExercise.id)) ?? null;

    const [allProgress, allCourses, existingBadges] = await Promise.all([
      tx.progress.findMany({
        where: {
          userId,
        },
        select: {
          exerciseId: true,
          completed: true,
          correct: true,
          attempts: true,
        },
      }),
      tx.course.findMany({
        select: {
          id: true,
          level: true,
          lessons: {
            select: {
              id: true,
              language: true,
              exercises: {
                select: {
                  id: true,
                  type: true,
                },
              },
            },
          },
        },
      }),
      tx.badge.findMany({
        where: {
          userId,
        },
        select: {
          name: true,
        },
      }),
    ]);

    const stats = buildGamificationStats({
      courses: allCourses,
      progress: allProgress,
      xp: updatedUser.xp,
      streak: updatedUser.streak,
    });
    const existingBadgeNames = new Set(existingBadges.map((badge) => badge.name));
    const badgesAwarded: BadgeDefinition[] = [];

    for (const badge of getEligibleBadges(stats)) {
      if (!existingBadgeNames.has(badge.name)) {
        await tx.badge.create({
          data: {
            userId,
            name: badge.name,
            icon: badge.icon,
          },
        });
        badgesAwarded.push(badge);
      }
    }

    return {
      attempts: progress.attempts,
      completed: progress.completed,
      correct: isCorrect,
      alreadyCompleted: wasAlreadyCompleted,
      xpEarned,
      totalXp: updatedUser.xp,
      lessonCompleted,
      completedCount: completedExerciseIds.size,
      totalCount: lessonExerciseIds.length,
      nextExerciseId: nextExercise?.id ?? null,
      badgeAwarded: badgesAwarded[0] ?? null,
      badgesAwarded,
      correctAnswer: !isCorrect && exercise.type === "MULTIPLE_CHOICE" ? exercise.correctAnswer : undefined,
    };
  });

  return NextResponse.json(result);
}

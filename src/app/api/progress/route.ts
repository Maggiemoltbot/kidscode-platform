import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sortLessonExercises } from "@/lib/lesson-queries";

const firstLessonBadge = {
  name: "Erster Schritt",
  icon: "🌟",
};

export const dynamic = "force-dynamic";

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

  if (exercise.type !== "MULTIPLE_CHOICE") {
    return NextResponse.json(
      { error: "Dieser Uebungstyp wird in der naechsten Phase bewertet." },
      { status: 400 }
    );
  }

  const isCorrect = answer === exercise.correctAnswer;
  const orderedExercises = sortLessonExercises(exercise.lesson.exercises);
  const lessonExerciseIds = orderedExercises.map((lessonExercise) => lessonExercise.id);
  const currentIndex = lessonExerciseIds.indexOf(exercise.id);
  const now = new Date();

  const result = await prisma.$transaction(async (tx) => {
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
        lastActiveAt: now,
      },
      select: {
        xp: true,
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

    let badgeAwarded: typeof firstLessonBadge | null = null;

    if (lessonCompleted) {
      const existingBadge = await tx.badge.findUnique({
        where: {
          userId_name: {
            userId,
            name: firstLessonBadge.name,
          },
        },
      });

      await tx.badge.upsert({
        where: {
          userId_name: {
            userId,
            name: firstLessonBadge.name,
          },
        },
        update: {},
        create: {
          userId,
          name: firstLessonBadge.name,
          icon: firstLessonBadge.icon,
        },
      });

      badgeAwarded = existingBadge ? null : firstLessonBadge;
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
      badgeAwarded,
      correctAnswer: isCorrect ? undefined : exercise.correctAnswer,
    };
  });

  return NextResponse.json(result);
}

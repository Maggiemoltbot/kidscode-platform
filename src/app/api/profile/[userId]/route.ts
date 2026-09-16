import { NextResponse } from "next/server";
import {
  buildGamificationStats,
  getEligibleBadges,
  getLevelUpState,
  getVisibleStreak,
} from "@/lib/gamification";
import { prisma } from "@/lib/prisma";

type ProfileRouteContext = {
  params: {
    userId: string;
  };
};

export const dynamic = "force-dynamic";

export async function GET(_request: Request, { params }: ProfileRouteContext) {
  const user = await prisma.user.findUnique({
    where: {
      id: params.userId,
    },
    select: {
      id: true,
      username: true,
      avatar: true,
      xp: true,
      streak: true,
      lastActiveAt: true,
      createdAt: true,
      badges: {
        orderBy: {
          earnedAt: "desc",
        },
        select: {
          id: true,
          name: true,
          icon: true,
          earnedAt: true,
        },
      },
    },
  });

  if (!user) {
    return NextResponse.json({ error: "Profil nicht gefunden." }, { status: 404 });
  }

  const courses = await prisma.course.findMany({
    orderBy: [
      {
        level: "asc",
      },
      {
        order: "asc",
      },
    ],
    include: {
      lessons: {
        orderBy: {
          order: "asc",
        },
        include: {
          exercises: {
            include: {
              progress: {
                where: {
                  userId: user.id,
                },
                select: {
                  completed: true,
                  correct: true,
                },
              },
            },
          },
        },
      },
    },
  });

  const progress = await prisma.progress.findMany({
    where: {
      userId: user.id,
    },
    select: {
      exerciseId: true,
      completed: true,
      correct: true,
      attempts: true,
    },
  });
  const visibleStreak = getVisibleStreak(user.streak, user.lastActiveAt);
  const stats = buildGamificationStats({
    courses,
    progress,
    xp: user.xp,
    streak: visibleStreak,
  });
  const eligibleBadges = getEligibleBadges(stats);
  const existingBadgeNames = new Set(user.badges.map((badge) => badge.name));
  const missingBadges = eligibleBadges.filter((badge) => !existingBadgeNames.has(badge.name));

  if (missingBadges.length > 0) {
    await prisma.$transaction(
      missingBadges.map((badge) =>
        prisma.badge.create({
          data: {
            userId: user.id,
            name: badge.name,
            icon: badge.icon,
          },
        })
      )
    );
  }

  const badges =
    missingBadges.length > 0
      ? await prisma.badge.findMany({
          where: {
            userId: user.id,
          },
          orderBy: {
            earnedAt: "desc",
          },
          select: {
            id: true,
            name: true,
            icon: true,
            earnedAt: true,
          },
        })
      : user.badges;

  const courseProgress = courses.map((course) => {
    const exercises = course.lessons.flatMap((lesson) => lesson.exercises);
    const completed = exercises.filter((exercise) =>
      exercise.progress.some((progress) => progress.completed)
    ).length;
    const correct = exercises.filter((exercise) =>
      exercise.progress.some((progress) => progress.correct)
    ).length;
    const total = exercises.length;

    return {
      id: course.id,
      title: course.title,
      level: course.level,
      completed,
      correct,
      total,
      percent: total === 0 ? 0 : Math.round((completed / total) * 100),
    };
  });

  const lessonProgress = courses.flatMap((course) =>
    course.lessons.map((lesson) => {
      const completed = lesson.exercises.filter((exercise) =>
        exercise.progress.some((progressItem) => progressItem.completed)
      ).length;
      const total = lesson.exercises.length;

      return {
        lessonId: lesson.id,
        courseId: course.id,
        completed,
        total,
        percent: total === 0 ? 0 : Math.round((completed / total) * 100),
      };
    })
  );

  return NextResponse.json({
    user: {
      id: user.id,
      username: user.username,
      avatar: user.avatar,
      xp: user.xp,
      createdAt: user.createdAt,
      badges: user.badges,
      streak: visibleStreak,
    },
    badges,
    courseProgress,
    lessonProgress,
    levelUp: getLevelUpState(stats),
  });
}

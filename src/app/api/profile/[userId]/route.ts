import { NextResponse } from "next/server";
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

  return NextResponse.json({
    user,
    badges: user.badges,
    courseProgress,
  });
}

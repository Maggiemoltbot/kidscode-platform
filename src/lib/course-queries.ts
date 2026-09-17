import { prisma } from "@/lib/prisma";
import { levelConfigs, levelOrder, type LevelSlug } from "@/lib/level-config";
import { translatedFields, type LocalizedFields } from "@/lib/localization";

export type LevelSummary = {
  slug: LevelSlug;
  title: string;
  description: string;
  lessonCount: number;
  courseCount: number;
};

export type LessonCardData = LocalizedFields & {
  id: string;
  title: string;
  language: string;
  order: number;
  exerciseCount: number;
  courseTitle: string;
};

export type CourseOverviewData = LocalizedFields & {
  id: string;
  title: string;
  description: string;
  lessonCount: number;
  exerciseCount: number;
  lessons: LessonCardData[];
};

export async function getLevelSummaries(): Promise<LevelSummary[]> {
  const courses = await prisma.course.findMany({
    include: {
      lessons: {
        include: {
          _count: {
            select: {
              exercises: true,
            },
          },
        },
      },
    },
  });

  return levelOrder.map((slug) => {
    const config = levelConfigs[slug];
    const levelCourses = courses.filter((course) => course.level === config.dbLevel);
    const lessonCount = levelCourses.reduce((sum, course) => sum + course.lessons.length, 0);

    return {
      slug,
      title: config.title,
      description: config.description,
      lessonCount,
      courseCount: levelCourses.length,
    };
  });
}

export async function getCoursesByLevel(slug: LevelSlug): Promise<CourseOverviewData[]> {
  const config = levelConfigs[slug];
  const courses = await prisma.course.findMany({
    where: {
      level: config.dbLevel,
    },
    orderBy: {
      order: "asc",
    },
    include: {
      lessons: {
        orderBy: {
          order: "asc",
        },
        include: {
          _count: {
            select: {
              exercises: true,
            },
          },
        },
      },
    },
  });

  return courses.map((course) => {
    const lessons = course.lessons.map((lesson) => ({
      ...translatedFields(lesson),
      id: lesson.id,
      title: lesson.title,
      language: lesson.language,
      order: lesson.order,
      exerciseCount: lesson._count.exercises,
      courseTitle: course.title,
    }));

    return {
      ...translatedFields(course),
      id: course.id,
      title: course.title,
      description: course.description,
      lessonCount: lessons.length,
      exerciseCount: lessons.reduce((sum, lesson) => sum + lesson.exerciseCount, 0),
      lessons,
    };
  });
}

import { notFound } from "next/navigation";
import { LessonTheoryView } from "@/components/lessons/lesson-theory-view";
import { getLessonByLevel } from "@/lib/lesson-queries";
import { getLevelConfig } from "@/lib/level-config";

type LessonPageProps = {
  params: {
    level: string;
    lessonId: string;
  };
};

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: LessonPageProps) {
  const level = getLevelConfig(params.level);

  if (!level) {
    return {
      title: "Lektion nicht gefunden | KidsCode",
    };
  }

  const lesson = await getLessonByLevel(level.slug, params.lessonId);

  if (!lesson) {
    return {
      title: "Lektion nicht gefunden | KidsCode",
    };
  }

  return {
    title: `${lesson.title} | KidsCode`,
    description: lesson.theory,
  };
}

export default async function LessonPage({ params }: LessonPageProps) {
  const level = getLevelConfig(params.level);

  if (!level) {
    notFound();
  }

  const lesson = await getLessonByLevel(level.slug, params.lessonId);

  if (!lesson) {
    notFound();
  }

  return <LessonTheoryView level={level} lesson={lesson} />;
}

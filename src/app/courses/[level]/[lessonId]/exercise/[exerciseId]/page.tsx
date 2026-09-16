import { notFound } from "next/navigation";
import { ExercisePreview } from "@/components/lessons/exercise-preview";
import { getExercisePreviewByLevel } from "@/lib/lesson-queries";
import { getLevelConfig } from "@/lib/level-config";

type ExercisePageProps = {
  params: {
    level: string;
    lessonId: string;
    exerciseId: string;
  };
};

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: ExercisePageProps) {
  const level = getLevelConfig(params.level);

  if (!level) {
    return {
      title: "Uebung nicht gefunden | KidsCode",
    };
  }

  const exercise = await getExercisePreviewByLevel(level.slug, params.lessonId, params.exerciseId);

  if (!exercise) {
    return {
      title: "Uebung nicht gefunden | KidsCode",
    };
  }

  return {
    title: `${exercise.lesson.title}: Uebung | KidsCode`,
    description: exercise.question,
  };
}

export default async function ExercisePage({ params }: ExercisePageProps) {
  const level = getLevelConfig(params.level);

  if (!level) {
    notFound();
  }

  const exercise = await getExercisePreviewByLevel(level.slug, params.lessonId, params.exerciseId);

  if (!exercise) {
    notFound();
  }

  return <ExercisePreview level={level} exercise={exercise} />;
}

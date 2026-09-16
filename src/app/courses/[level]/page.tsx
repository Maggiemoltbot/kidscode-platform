import { notFound } from "next/navigation";
import { CourseLevelView } from "@/components/courses/course-level-view";
import { getCoursesByLevel } from "@/lib/course-queries";
import { getLevelConfig } from "@/lib/level-config";

type CoursesByLevelPageProps = {
  params: {
    level: string;
  };
};

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: CoursesByLevelPageProps) {
  const level = getLevelConfig(params.level);

  if (!level) {
    return {
      title: "Level nicht gefunden | KidsCode",
    };
  }

  return {
    title: `${level.title}-Kurse | KidsCode`,
    description: level.description,
  };
}

export default async function CoursesByLevelPage({ params }: CoursesByLevelPageProps) {
  const level = getLevelConfig(params.level);

  if (!level) {
    notFound();
  }

  const courses = await getCoursesByLevel(level.slug);

  return <CourseLevelView level={level} courses={courses} />;
}

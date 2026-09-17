"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen, Code2, Home } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { type CourseOverviewData } from "@/lib/course-queries";
import { type LevelConfig } from "@/lib/level-config";
import { PROFILE_STORAGE_KEY } from "@/lib/storage-keys";
import { cn } from "@/lib/utils";

type CourseLevelViewProps = {
  level: LevelConfig;
  courses: CourseOverviewData[];
};

type ProgressSummary = {
  courseProgress: {
    id: string;
    completed: number;
    total: number;
    percent: number;
  }[];
  lessonProgress: {
    lessonId: string;
    completed: number;
    total: number;
    percent: number;
  }[];
};

const fadeInUp = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0 },
};

export function CourseLevelView({ level, courses }: CourseLevelViewProps) {
  const [progress, setProgress] = useState<ProgressSummary | null>(null);
  const totalLessons = courses.reduce((sum, course) => sum + course.lessonCount, 0);
  const totalExercises = courses.reduce((sum, course) => sum + course.exerciseCount, 0);
  const courseProgressById = useMemo(
    () => new Map(progress?.courseProgress.map((item) => [item.id, item]) ?? []),
    [progress?.courseProgress]
  );
  const lessonProgressById = useMemo(
    () => new Map(progress?.lessonProgress.map((item) => [item.lessonId, item]) ?? []),
    [progress?.lessonProgress]
  );

  useEffect(() => {
    const userId = window.localStorage.getItem(PROFILE_STORAGE_KEY);

    if (!userId) {
      return;
    }

    async function loadProgress(profileId: string) {
      const response = await fetch(`/api/profile/${profileId}`, {
        cache: "no-store",
      });

      if (response.ok) {
        const payload = (await response.json()) as ProgressSummary;
        setProgress(payload);
      }
    }

    void loadProgress(userId);
  }, []);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-8 sm:py-10 lg:px-10">
      <nav className="mb-8 flex flex-wrap items-center gap-2 text-sm font-bold text-muted-foreground">
        <Link href="/" className="inline-flex items-center gap-1 transition-colors hover:text-foreground">
          <Home className="size-4" aria-hidden="true" />
          Home
        </Link>
        <span>/</span>
        <span className="text-foreground">{level.title}</span>
      </nav>

      <header className="grid gap-6 rounded-apple-xl bg-card p-5 shadow-sm sm:p-6 md:grid-cols-[1fr_auto] md:items-end">
        <div className="space-y-4">
          <div className={cn("inline-flex rounded-full bg-gradient-to-r px-4 py-2 text-sm font-semibold", level.accentClass)}>
            {level.title}
          </div>
          <div className="space-y-3">
            <h1 className="text-3xl font-semibold text-foreground sm:text-5xl">{level.title}-Kurse</h1>
            <p className="max-w-2xl text-base leading-7 text-muted-foreground">{level.description}</p>
          </div>
        </div>
        <div className="grid gap-3 min-[420px]:grid-cols-2 sm:min-w-64">
          <div className="rounded-md bg-muted p-4">
            <p className="text-sm font-bold text-muted-foreground">Lektionen</p>
            <p className="mt-1 text-3xl font-semibold">{totalLessons}</p>
          </div>
          <div className="rounded-md bg-muted p-4">
            <p className="text-sm font-bold text-muted-foreground">Übungen</p>
            <p className="mt-1 text-3xl font-semibold">{totalExercises}</p>
          </div>
        </div>
      </header>

      <section className="mt-10 space-y-8">
        {courses.length === 0 ? (
          <motion.div
            className="rounded-lg border border-dashed border-border bg-card p-8 text-center"
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <BookOpen className="mx-auto size-10 text-muted-foreground" aria-hidden="true" />
            <h2 className="mt-4 text-2xl font-semibold">Noch keine Kurse in diesem Level</h2>
            <p className="mt-2 text-muted-foreground">Die Inhalte werden in M8 vollständig aufgefüllt.</p>
          </motion.div>
        ) : (
          courses.map((course, courseIndex) => {
            const courseProgress = courseProgressById.get(course.id);

            return (
              <motion.article
                key={course.id}
                className="space-y-4"
                variants={fadeInUp}
                initial="hidden"
                animate="visible"
                transition={{ duration: 0.3, delay: courseIndex * 0.08, ease: "easeOut" }}
              >
                <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-normal text-accent">
                      {course.lessonCount} Lektionen
                    </p>
                    <h2 className="text-2xl font-semibold sm:text-3xl">{course.title}</h2>
                    <p className="mt-2 max-w-2xl text-muted-foreground">{course.description}</p>
                  </div>
                  <span className="w-fit rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
                    {courseProgress?.completed ?? 0} / {course.exerciseCount} erledigt
                  </span>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  {course.lessons.map((lesson, index) => {
                    const lessonProgress = lessonProgressById.get(lesson.id);
                    const statusLabel =
                      lessonProgress?.percent === 100
                        ? "Fertig"
                        : lessonProgress && lessonProgress.percent > 0
                          ? `${lessonProgress.percent}%`
                          : "Bereit";

                    return (
                      <motion.div
                        key={lesson.id}
                        variants={fadeInUp}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.4, delay: index * 0.06, ease: "easeOut" }}
                        whileHover={{ y: -5 }}
                      >
                        <Link
                          href={`/courses/${level.slug}/${lesson.id}`}
                          className="group flex h-full min-h-48 flex-col rounded-apple-xl bg-card p-5 shadow-sm transition-shadow hover:shadow-lg"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
                              <Code2 className="size-5" aria-hidden="true" />
                            </span>
                            <span
                              className={cn(
                                "rounded-full px-3 py-1 text-xs font-semibold",
                                lessonProgress?.percent === 100
                                  ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-200"
                                  : "bg-accent/15 text-accent"
                              )}
                            >
                              {statusLabel}
                            </span>
                          </div>
                          <div className="mt-5 space-y-2">
                            <p className="text-xs font-semibold uppercase tracking-normal text-muted-foreground">
                              Lektion {lesson.order} · {lesson.language}
                            </p>
                            <h3 className="text-xl font-semibold text-foreground">{lesson.title}</h3>
                            <p className="text-sm text-muted-foreground">
                              {lessonProgress?.completed ?? 0} von {lesson.exerciseCount} Übungen
                            </p>
                          </div>
                          <div className="mt-auto pt-5">
                            <div className="h-2 overflow-hidden rounded-full bg-muted">
                              <div
                                className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
                                style={{ width: `${lessonProgress?.percent ?? 0}%` }}
                              />
                            </div>
                            <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-primary">
                              Lektion starten
                              <ArrowRight
                                className="size-4 transition-transform group-hover:translate-x-1"
                                aria-hidden="true"
                              />
                            </div>
                          </div>
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.article>
            );
          })
        )}
      </section>

      <div className="mt-10">
        <Link href="/" className={cn(buttonVariants({ variant: "outline" }), "h-10 px-4")}>
          Zurück zur Level-Auswahl
        </Link>
      </div>
    </div>
  );
}

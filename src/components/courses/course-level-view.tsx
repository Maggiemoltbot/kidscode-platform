"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen, Code2, Home } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { type CourseOverviewData } from "@/lib/course-queries";
import { type LevelConfig } from "@/lib/level-config";
import { cn } from "@/lib/utils";

type CourseLevelViewProps = {
  level: LevelConfig;
  courses: CourseOverviewData[];
};

const fadeInUp = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0 },
};

export function CourseLevelView({ level, courses }: CourseLevelViewProps) {
  const totalLessons = courses.reduce((sum, course) => sum + course.lessonCount, 0);
  const totalExercises = courses.reduce((sum, course) => sum + course.exerciseCount, 0);

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-10 sm:px-8 lg:px-10">
      <nav className="mb-8 flex flex-wrap items-center gap-2 text-sm font-bold text-muted-foreground">
        <Link href="/" className="inline-flex items-center gap-1 transition-colors hover:text-foreground">
          <Home className="size-4" aria-hidden="true" />
          Home
        </Link>
        <span>/</span>
        <span className="text-foreground">{level.title}</span>
      </nav>

      <header className="grid gap-6 rounded-lg border border-border bg-card p-6 shadow-sm md:grid-cols-[1fr_auto] md:items-end">
        <div className="space-y-4">
          <div className={cn("inline-flex rounded-full bg-gradient-to-r px-4 py-2 text-sm font-black", level.accentClass)}>
            {level.title}
          </div>
          <div className="space-y-3">
            <h1 className="text-4xl font-black text-foreground sm:text-5xl">{level.title}-Kurse</h1>
            <p className="max-w-2xl text-base leading-7 text-muted-foreground">{level.description}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:min-w-64">
          <div className="rounded-md bg-muted p-4">
            <p className="text-sm font-bold text-muted-foreground">Lektionen</p>
            <p className="mt-1 text-3xl font-black">{totalLessons}</p>
          </div>
          <div className="rounded-md bg-muted p-4">
            <p className="text-sm font-bold text-muted-foreground">Uebungen</p>
            <p className="mt-1 text-3xl font-black">{totalExercises}</p>
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
            <h2 className="mt-4 text-2xl font-black">Noch keine Kurse in diesem Level</h2>
            <p className="mt-2 text-muted-foreground">Die Inhalte werden in M8 vollstaendig aufgefuellt.</p>
          </motion.div>
        ) : (
          courses.map((course, courseIndex) => (
            <motion.article
              key={course.id}
              className="space-y-4"
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              transition={{ duration: 0.45, delay: courseIndex * 0.08, ease: "easeOut" }}
            >
              <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
                <div>
                  <p className="text-sm font-black uppercase tracking-normal text-accent">{course.lessonCount} Lektionen</p>
                  <h2 className="text-3xl font-black">{course.title}</h2>
                  <p className="mt-2 max-w-2xl text-muted-foreground">{course.description}</p>
                </div>
                <span className="rounded-full bg-primary/10 px-4 py-2 text-sm font-black text-primary">
                  0 / {course.exerciseCount} erledigt
                </span>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                {course.lessons.map((lesson, index) => (
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
                      className="group flex h-full min-h-48 flex-col rounded-lg border border-border bg-card p-5 shadow-sm transition-shadow hover:shadow-lg"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <span className="flex size-11 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
                          <Code2 className="size-5" aria-hidden="true" />
                        </span>
                        <span className="rounded-full bg-accent/15 px-3 py-1 text-xs font-black text-accent">
                          Bereit
                        </span>
                      </div>
                      <div className="mt-5 space-y-2">
                        <p className="text-xs font-black uppercase tracking-normal text-muted-foreground">
                          Lektion {lesson.order} · {lesson.language}
                        </p>
                        <h3 className="text-xl font-black text-foreground">{lesson.title}</h3>
                        <p className="text-sm text-muted-foreground">{lesson.exerciseCount} Uebungen</p>
                      </div>
                      <div className="mt-auto flex items-center gap-2 pt-5 text-sm font-black text-primary">
                        Lektion starten
                        <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.article>
          ))
        )}
      </section>

      <div className="mt-10">
        <Link href="/" className={cn(buttonVariants({ variant: "outline" }), "h-10 px-4")}>
          Zurueck zur Level-Auswahl
        </Link>
      </div>
    </div>
  );
}

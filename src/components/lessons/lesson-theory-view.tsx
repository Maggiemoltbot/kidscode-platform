"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen, CheckCircle2, ChevronRight, Home, Lightbulb, Play } from "lucide-react";
import { RobotMascot } from "@/components/mascot/robot-mascot";
import { buttonVariants } from "@/components/ui/button";
import { type LessonDetailData } from "@/lib/lesson-queries";
import { type LevelConfig } from "@/lib/level-config";
import { cn } from "@/lib/utils";

type LessonTheoryViewProps = {
  level: LevelConfig;
  lesson: LessonDetailData;
};

const fadeInUp = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0 },
};

const languageLabels: Record<string, string> = {
  python: "Python",
  html: "HTML",
};

function TheoryCodeBlock({ code, language }: { code: string; language: string }) {
  return (
    <div className="overflow-hidden rounded-lg border border-border bg-[#181321] shadow-sm">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="size-3 rounded-full bg-[#F97316]" />
          <span className="size-3 rounded-full bg-[#FBBF24]" />
          <span className="size-3 rounded-full bg-[#22C55E]" />
        </div>
        <span className="text-xs font-black uppercase tracking-normal text-white/60">
          {languageLabels[language] ?? language}
        </span>
      </div>
      <pre className="overflow-x-auto p-5 text-sm leading-7 text-violet-100 sm:text-base">
        <code>{code}</code>
      </pre>
    </div>
  );
}

export function LessonTheoryView({ level, lesson }: LessonTheoryViewProps) {
  const firstExercise = lesson.exercises[0];
  const exerciseCount = lesson.exercises.length;

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-10 sm:px-8 lg:px-10">
      <nav className="mb-8 flex flex-wrap items-center gap-2 text-sm font-bold text-muted-foreground">
        <Link href="/" className="inline-flex items-center gap-1 transition-colors hover:text-foreground">
          <Home className="size-4" aria-hidden="true" />
          Home
        </Link>
        <ChevronRight className="size-4" aria-hidden="true" />
        <Link href={`/courses/${level.slug}`} className="transition-colors hover:text-foreground">
          {level.title}
        </Link>
        <ChevronRight className="size-4" aria-hidden="true" />
        <span className="text-foreground">{lesson.title}</span>
      </nav>

      <motion.header
        className="mb-7 space-y-4"
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        transition={{ duration: 0.45, ease: "easeOut" }}
      >
        <div className="flex flex-wrap items-center gap-3">
          <span className={cn("inline-flex rounded-full bg-gradient-to-r px-4 py-2 text-sm font-black", level.accentClass)}>
            {level.title}
          </span>
          <span className="inline-flex rounded-full bg-muted px-4 py-2 text-sm font-black text-muted-foreground">
            Lektion {lesson.order} · {lesson.language}
          </span>
        </div>
        <div className="grid gap-3 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <p className="text-sm font-black uppercase tracking-normal text-accent">{lesson.course.title}</p>
            <h1 className="mt-2 text-4xl font-black text-foreground sm:text-5xl">{lesson.title}</h1>
          </div>
          <div className="rounded-lg border border-border bg-card p-4 shadow-sm md:min-w-56">
            <p className="text-sm font-black text-muted-foreground">Nächster Schritt</p>
            <p className="mt-1 text-2xl font-black">Übung 1 von {exerciseCount}</p>
          </div>
        </div>
      </motion.header>

      <motion.div
        className="mb-8 overflow-hidden rounded-full bg-muted"
        initial={{ opacity: 0, scaleX: 0.96 }}
        animate={{ opacity: 1, scaleX: 1 }}
        transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
      >
        <div className="h-3 w-[12%] rounded-full bg-gradient-to-r from-primary to-accent" />
      </motion.div>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
        <motion.main
          className="space-y-6"
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.5, delay: 0.08, ease: "easeOut" }}
        >
          <section className="rounded-lg border border-border bg-card p-6 shadow-sm">
            <div className="mb-5 flex items-center gap-3">
              <span className="flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <BookOpen className="size-5" aria-hidden="true" />
              </span>
              <div>
                <p className="text-sm font-black uppercase tracking-normal text-accent">Theorie</p>
                <h2 className="text-2xl font-black">Kurz erklaert</h2>
              </div>
            </div>
            <p className="text-lg leading-8 text-muted-foreground">{lesson.theory}</p>
          </section>

          <section className="space-y-4 rounded-lg border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="flex size-11 items-center justify-center rounded-lg bg-accent/10 text-accent">
                <Lightbulb className="size-5" aria-hidden="true" />
              </span>
              <div>
                <p className="text-sm font-black uppercase tracking-normal text-accent">Beispiel</p>
                <h2 className="text-2xl font-black">So sieht der Code aus</h2>
              </div>
            </div>
            <TheoryCodeBlock code={lesson.sampleCode} language={lesson.language} />
          </section>

          <section className="rounded-lg border border-border bg-card p-6 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-black uppercase tracking-normal text-muted-foreground">
                  {exerciseCount} Übungen warten
                </p>
                <h2 className="text-2xl font-black">Bereit zum Ausprobieren?</h2>
              </div>
              {firstExercise ? (
                <Link
                  href={`/courses/${level.slug}/${lesson.id}/exercise/${firstExercise.id}`}
                  className={cn(buttonVariants({ size: "lg" }), "h-12 px-5 text-base")}
                >
                  Zur Übung!
                  <Play className="size-5" aria-hidden="true" />
                </Link>
              ) : (
                <Link
                  href={`/courses/${level.slug}`}
                  className={cn(buttonVariants({ variant: "outline", size: "lg" }), "h-12 px-5 text-base")}
                >
                  Zur Kursübersicht
                  <ArrowRight className="size-5" aria-hidden="true" />
                </Link>
              )}
            </div>
          </section>
        </motion.main>

        <motion.aside
          className="space-y-4"
          initial={{ opacity: 0, x: 18 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.16, ease: "easeOut" }}
        >
          <div className="rounded-lg border border-border bg-card p-5 shadow-sm">
            <div className="relative rounded-lg bg-gradient-to-br from-primary/10 to-accent/15 p-4">
              <RobotMascot className="mx-auto max-w-[210px]" />
            </div>
            <div className="mt-4 rounded-lg bg-muted p-4">
              <p className="text-sm font-black text-primary">Robo sagt:</p>
              <p className="mt-2 leading-7 text-muted-foreground">{lesson.mascotMessage}</p>
            </div>
          </div>

          <div className="rounded-lg border border-border bg-card p-5 shadow-sm">
            <p className="text-sm font-black uppercase tracking-normal text-muted-foreground">In dieser Lektion</p>
            <div className="mt-4 space-y-3">
              {lesson.exercises.map((exercise) => (
                <div key={exercise.id} className="flex items-center gap-3 rounded-md bg-muted p-3">
                  <CheckCircle2 className="size-5 text-primary" aria-hidden="true" />
                  <div>
                    <p className="text-sm font-black">Übung {exercise.order}</p>
                    <p className="text-xs font-bold text-muted-foreground">{exercise.xpReward} XP</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.aside>
      </div>
    </div>
  );
}

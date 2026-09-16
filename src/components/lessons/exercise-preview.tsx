"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, BadgeCheck, CircleDot, Sparkles } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { type ExercisePreviewData } from "@/lib/lesson-queries";
import { type LevelConfig } from "@/lib/level-config";
import { cn } from "@/lib/utils";

type ExercisePreviewProps = {
  level: LevelConfig;
  exercise: ExercisePreviewData;
};

export function ExercisePreview({ level, exercise }: ExercisePreviewProps) {
  return (
    <div className="mx-auto grid min-h-[calc(100svh-8rem)] w-full max-w-4xl place-items-center px-6 py-10 sm:px-8 lg:px-10">
      <motion.section
        className="w-full rounded-lg border border-border bg-card p-6 shadow-sm sm:p-8"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
      >
        <div className="flex flex-wrap items-center gap-3">
          <span className={cn("inline-flex rounded-full bg-gradient-to-r px-4 py-2 text-sm font-black", level.accentClass)}>
            {level.title}
          </span>
          <span className="inline-flex rounded-full bg-muted px-4 py-2 text-sm font-black text-muted-foreground">
            {exercise.lesson.language}
          </span>
        </div>

        <div className="mt-7 space-y-3">
          <p className="text-sm font-black uppercase tracking-normal text-accent">
            {exercise.lesson.course.title} · {exercise.lesson.title}
          </p>
          <h1 className="text-4xl font-black text-foreground">Uebung {exercise.order}</h1>
          <p className="text-lg leading-8 text-muted-foreground">{exercise.question}</p>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg bg-primary/10 p-4">
            <Sparkles className="size-6 text-primary" aria-hidden="true" />
            <p className="mt-3 text-sm font-black text-muted-foreground">Belohnung</p>
            <p className="text-2xl font-black">{exercise.xpReward} XP</p>
          </div>
          <div className="rounded-lg bg-accent/10 p-4">
            <CircleDot className="size-6 text-accent" aria-hidden="true" />
            <p className="mt-3 text-sm font-black text-muted-foreground">Typ</p>
            <p className="text-2xl font-black">{exercise.type.replace("_", " ")}</p>
          </div>
          <div className="rounded-lg bg-muted p-4">
            <BadgeCheck className="size-6 text-primary" aria-hidden="true" />
            <p className="mt-3 text-sm font-black text-muted-foreground">Status</p>
            <p className="text-2xl font-black">Bereit</p>
          </div>
        </div>

        <div className="mt-8 rounded-lg bg-muted p-5">
          <p className="text-sm font-black text-primary">Tipp</p>
          <p className="mt-2 leading-7 text-muted-foreground">{exercise.hint}</p>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href={`/courses/${level.slug}/${exercise.lesson.id}`}
            className={cn(buttonVariants({ variant: "outline", size: "lg" }), "h-12 px-5 text-base")}
          >
            <ArrowLeft className="size-5" aria-hidden="true" />
            Zur Theorie
          </Link>
          <span
            className={cn(
              buttonVariants({ size: "lg" }),
              "h-12 cursor-default bg-primary/80 px-5 text-base hover:bg-primary/80"
            )}
          >
            Interaktive Antwort folgt in M5
          </span>
        </div>
      </motion.section>
    </div>
  );
}

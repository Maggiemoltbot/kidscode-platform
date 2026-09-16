"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  CircleDot,
  Sparkles,
  Trophy,
  XCircle,
} from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { PROFILE_STORAGE_KEY } from "@/lib/storage-keys";
import { type ExercisePreviewData } from "@/lib/lesson-queries";
import { type LevelConfig } from "@/lib/level-config";
import { cn } from "@/lib/utils";

type ExercisePreviewProps = {
  level: LevelConfig;
  exercise: ExercisePreviewData;
};

type ProgressResult = {
  attempts: number;
  completed: boolean;
  correct: boolean;
  alreadyCompleted: boolean;
  xpEarned: number;
  totalXp: number;
  lessonCompleted: boolean;
  completedCount: number;
  totalCount: number;
  nextExerciseId: string | null;
  badgeAwarded: {
    name: string;
    icon: string;
  } | null;
  correctAnswer?: string;
};

const confettiParticles = Array.from({ length: 24 }, (_, index) => {
  const angle = (index / 24) * Math.PI * 2;
  const distance = 72 + (index % 5) * 12;

  return {
    id: index,
    color: ["#7C3AED", "#F97316", "#22C55E", "#FBBF24"][index % 4],
    x: Math.cos(angle) * distance,
    y: Math.sin(angle) * distance,
    rotate: index * 37,
  };
});

function getExerciseTypeLabel(type: string) {
  if (type === "MULTIPLE_CHOICE") {
    return "Multiple Choice";
  }

  if (type === "CODE_GAP") {
    return "Code-Luecke";
  }

  return "Freier Code";
}

export function ExercisePreview({ level, exercise }: ExercisePreviewProps) {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [hasCheckedProfile, setHasCheckedProfile] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [result, setResult] = useState<ProgressResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);

  const progressPercent = useMemo(() => {
    const completedCount = result?.completedCount ?? Math.max(exercise.order - 1, 0);
    return Math.min(100, Math.round((completedCount / exercise.totalExercises) * 100));
  }, [exercise.order, exercise.totalExercises, result?.completedCount]);

  const isMultipleChoice = exercise.type === "MULTIPLE_CHOICE" && exercise.options.length > 0;

  useEffect(() => {
    setUserId(window.localStorage.getItem(PROFILE_STORAGE_KEY));
    setHasCheckedProfile(true);
  }, []);

  async function submitAnswer(answer: string) {
    if (!userId || result || isSubmitting) {
      return;
    }

    setSelectedAnswer(answer);
    setError(null);
    setIsSubmitting(true);

    const response = await fetch("/api/progress", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        userId,
        exerciseId: exercise.id,
        answer,
      }),
    });

    const payload = (await response.json().catch(() => null)) as ProgressResult | { error?: string } | null;
    setIsSubmitting(false);

    if (!response.ok || !payload) {
      const errorPayload = payload as { error?: string } | null;
      setError(errorPayload?.error ?? "Die Antwort konnte gerade nicht gespeichert werden.");
      setSelectedAnswer(null);
      return;
    }

    setResult(payload as ProgressResult);
  }

  function handleNext() {
    if (!result) {
      return;
    }

    if (!result.correct) {
      setSelectedAnswer(null);
      setResult(null);
      return;
    }

    if (result.lessonCompleted) {
      setShowCompletion(true);
      return;
    }

    if (result.nextExerciseId) {
      router.push(`/courses/${level.slug}/${exercise.lesson.id}/exercise/${result.nextExerciseId}`);
      return;
    }

    router.push(`/courses/${level.slug}/${exercise.lesson.id}`);
  }

  if (showCompletion && result) {
    return (
      <div className="mx-auto grid min-h-[calc(100svh-8rem)] w-full max-w-4xl place-items-center px-6 py-10 sm:px-8 lg:px-10">
        <motion.section
          className="relative w-full overflow-hidden rounded-lg border border-primary/20 bg-card p-8 text-center shadow-xl shadow-primary/10"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
        >
          <ConfettiBurst />
          <div className="mx-auto flex size-20 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Trophy className="size-10" aria-hidden="true" />
          </div>
          <p className="mt-6 text-sm font-black uppercase tracking-normal text-accent">Lektion abgeschlossen</p>
          <h1 className="mt-2 text-4xl font-black sm:text-5xl">{exercise.lesson.title}</h1>
          <motion.p
            className="mt-5 text-3xl font-black text-primary"
            initial={{ scale: 0.75, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 180, damping: 12, delay: 0.2 }}
          >
            +{result.xpEarned} XP
          </motion.p>
          {result.badgeAwarded ? (
            <div className="mx-auto mt-6 max-w-sm rounded-lg bg-accent/10 p-5">
              <p className="text-4xl">{result.badgeAwarded.icon}</p>
              <p className="mt-2 text-xl font-black">{result.badgeAwarded.name}</p>
            </div>
          ) : (
            <p className="mt-5 text-muted-foreground">Dein Fortschritt wurde gespeichert.</p>
          )}
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/profile" className={cn(buttonVariants({ size: "lg" }), "h-12 px-5 text-base")}>
              Zum Profil
              <ArrowRight className="size-5" aria-hidden="true" />
            </Link>
            <Link
              href={`/courses/${level.slug}`}
              className={cn(buttonVariants({ variant: "outline", size: "lg" }), "h-12 px-5 text-base")}
            >
              Weitere Lektionen
            </Link>
          </div>
        </motion.section>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-10 sm:px-8 lg:px-10">
      <div className="mb-8">
        <Link
          href={`/courses/${level.slug}/${exercise.lesson.id}`}
          className="inline-flex items-center gap-2 text-sm font-black text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Zurueck zur Theorie
        </Link>
      </div>

      <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
        <motion.main
          className="relative overflow-hidden rounded-lg border border-border bg-card p-6 shadow-sm sm:p-8"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
        >
          {result?.correct ? <ConfettiBurst /> : null}

          <div className="flex flex-wrap items-center gap-3">
            <span className={cn("inline-flex rounded-full bg-gradient-to-r px-4 py-2 text-sm font-black", level.accentClass)}>
              {level.title}
            </span>
            <span className="inline-flex rounded-full bg-muted px-4 py-2 text-sm font-black text-muted-foreground">
              {getExerciseTypeLabel(exercise.type)}
            </span>
          </div>

          <div className="mt-7 space-y-3">
            <p className="text-sm font-black uppercase tracking-normal text-accent">
              {exercise.lesson.course.title} · {exercise.lesson.title}
            </p>
            <h1 className="text-4xl font-black text-foreground">Uebung {exercise.order}</h1>
            <p className="text-lg leading-8 text-muted-foreground">{exercise.question}</p>
          </div>

          <div className="mt-6 h-3 overflow-hidden rounded-full bg-muted">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
              initial={{ width: `${Math.max(progressPercent - 12, 0)}%` }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.35, ease: "easeOut" }}
            />
          </div>

          {!hasCheckedProfile ? (
            <div className="mt-8 h-40 animate-pulse rounded-lg bg-muted" />
          ) : !userId ? (
            <div className="mt-8 rounded-lg bg-muted p-5">
              <p className="font-black">Lege zuerst ein Profil an.</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Dann koennen XP, Badges und Fortschritt gespeichert werden.
              </p>
              <Link href="/profile/new" className={cn(buttonVariants(), "mt-4 h-10 px-4")}>
                Profil anlegen
              </Link>
            </div>
          ) : isMultipleChoice ? (
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {exercise.options.map((option) => {
                const isSelected = selectedAnswer === option;
                const isCorrectSelection = result?.correct && isSelected;
                const isWrongSelection = result && !result.correct && isSelected;
                const isCorrectAnswer = result?.correctAnswer === option;

                return (
                  <motion.button
                    key={option}
                    type="button"
                    className={cn(
                      "min-h-24 rounded-lg border border-border bg-background p-4 text-left text-base font-black shadow-sm transition disabled:cursor-default sm:text-lg",
                      "hover:border-primary/40 hover:shadow-md",
                      isCorrectSelection &&
                        "border-emerald-400 bg-emerald-50 text-emerald-900 shadow-[0_0_28px_rgba(34,197,94,0.35)] dark:bg-emerald-950/40 dark:text-emerald-100",
                      isWrongSelection && "border-red-400 bg-red-50 text-red-900 dark:bg-red-950/40 dark:text-red-100",
                      isCorrectAnswer &&
                        "border-emerald-400 bg-emerald-50 text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-100"
                    )}
                    disabled={Boolean(result) || isSubmitting}
                    aria-pressed={isSelected}
                    animate={isWrongSelection ? { x: [0, -8, 8, -6, 6, 0] } : undefined}
                    transition={{ duration: 0.35 }}
                    onClick={() => void submitAnswer(option)}
                  >
                    <span className="flex items-center gap-3">
                      {isCorrectSelection || isCorrectAnswer ? (
                        <CheckCircle2 className="size-5 text-emerald-600" aria-hidden="true" />
                      ) : isWrongSelection ? (
                        <XCircle className="size-5 text-red-600" aria-hidden="true" />
                      ) : (
                        <CircleDot className="size-5 text-muted-foreground" aria-hidden="true" />
                      )}
                      <span>{option}</span>
                    </span>
                  </motion.button>
                );
              })}
            </div>
          ) : (
            <div className="mt-8 rounded-lg bg-muted p-5">
              <p className="font-black">Dieser Uebungstyp kommt in M6.</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Code-Luecken und freie Code-Aufgaben werden mit CodeMirror und Pyodide umgesetzt.
              </p>
            </div>
          )}

          {error ? <p className="mt-4 text-sm font-bold text-destructive">{error}</p> : null}

          {result ? (
            <motion.div
              className={cn(
                "mt-6 rounded-lg p-5",
                result.correct
                  ? "bg-emerald-50 text-emerald-950 dark:bg-emerald-950/40 dark:text-emerald-50"
                  : "bg-red-50 text-red-950 dark:bg-red-950/40 dark:text-red-50"
              )}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
            >
              <p className="text-xl font-black">{result.correct ? "Richtig!" : "Fast. Versuch es nochmal!"}</p>
              <p className="mt-2 text-sm font-bold">
                {result.correct
                  ? result.alreadyCompleted
                    ? "Diese Uebung war schon erledigt, deshalb gibt es keine doppelten XP."
                    : `Du bekommst ${result.xpEarned} XP.`
                  : "Der rote Knopf zeigt deine Auswahl. Die gruene Antwort hilft dir beim Lernen."}
              </p>
              <Button className="mt-5 h-11 px-5 text-base" onClick={handleNext}>
                {result.correct ? "Weiter" : "Nochmal probieren"}
                <ArrowRight className="size-5" aria-hidden="true" />
              </Button>
            </motion.div>
          ) : null}
        </motion.main>

        <aside className="space-y-4">
          <div className="rounded-lg border border-border bg-card p-5 shadow-sm">
            <Sparkles className="size-7 text-primary" aria-hidden="true" />
            <p className="mt-4 text-sm font-black text-muted-foreground">Belohnung</p>
            <p className="text-3xl font-black">{exercise.xpReward} XP</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-5 shadow-sm">
            <BadgeCheck className="size-7 text-accent" aria-hidden="true" />
            <p className="mt-4 text-sm font-black text-muted-foreground">Fortschritt</p>
            <p className="text-3xl font-black">
              {result?.completedCount ?? Math.max(exercise.order - 1, 0)} / {exercise.totalExercises}
            </p>
          </div>
          <div className="rounded-lg border border-border bg-card p-5 shadow-sm">
            <p className="text-sm font-black text-primary">Tipp</p>
            <p className="mt-2 leading-7 text-muted-foreground">{exercise.hint}</p>
          </div>
        </aside>
      </section>
    </div>
  );
}

function ConfettiBurst() {
  return (
    <div className="pointer-events-none absolute left-1/2 top-24 z-10">
      {confettiParticles.map((particle) => (
        <motion.span
          key={particle.id}
          className="absolute block size-2 rounded-sm"
          style={{
            backgroundColor: particle.color,
          }}
          initial={{ opacity: 1, x: 0, y: 0, rotate: 0, scale: 1 }}
          animate={{ opacity: 0, x: particle.x, y: particle.y, rotate: particle.rotate, scale: 0.4 }}
          transition={{ duration: 0.75, ease: "easeOut" }}
        />
      ))}
    </div>
  );
}

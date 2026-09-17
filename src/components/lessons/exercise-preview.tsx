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
  Code2,
  Loader2,
  Monitor,
  Play,
  Sparkles,
  Terminal,
  Trophy,
  XCircle,
} from "lucide-react";
import { CodeEditor } from "@/components/editor/code-editor";
import { Button, buttonVariants } from "@/components/ui/button";
import { PROFILE_STORAGE_KEY } from "@/lib/storage-keys";
import { type ExercisePreviewData } from "@/lib/lesson-queries";
import { runPythonCode } from "@/lib/pyodide-loader";
import { type LevelConfig } from "@/lib/level-config";
import { cn } from "@/lib/utils";

type ExercisePreviewProps = {
  level: LevelConfig;
  exercise: ExercisePreviewData;
};

type AwardedBadge = {
  name: string;
  icon: string;
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
  badgeAwarded: AwardedBadge | null;
  badgesAwarded?: AwardedBadge[];
  correctAnswer?: string;
};

type CodeLanguage = "python" | "html";

const emptyTerminal = "Noch keine Ausgabe.";

const confettiParticles = Array.from({ length: 20 }, (_, index) => {
  const angle = (index / 20) * Math.PI * 2;
  const distance = 72 + (index % 5) * 12;

  return {
    id: index,
    color: ["#007AFF", "#AF52DE", "#FF9500", "#34C759", "#FFCC00"][index % 5],
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
    return "Code-Lücke";
  }

  return "Freier Code";
}

function getEditorLanguage(language: string): CodeLanguage {
  return language.toLowerCase() === "html" ? "html" : "python";
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
  const [codeValue, setCodeValue] = useState(exercise.starterCode);
  const [terminalOutput, setTerminalOutput] = useState(emptyTerminal);
  const [runtimeError, setRuntimeError] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  const editorLanguage = useMemo(() => getEditorLanguage(exercise.lesson.language), [exercise.lesson.language]);
  const isMultipleChoice = exercise.type === "MULTIPLE_CHOICE" && exercise.options.length > 0;
  const isCodeExercise = exercise.type === "CODE_GAP" || exercise.type === "FREE_CODE";

  const progressPercent = useMemo(() => {
    const completedCount = result?.completedCount ?? Math.max(exercise.order - 1, 0);
    return Math.min(100, Math.round((completedCount / exercise.totalExercises) * 100));
  }, [exercise.order, exercise.totalExercises, result?.completedCount]);

  useEffect(() => {
    setUserId(window.localStorage.getItem(PROFILE_STORAGE_KEY));
    setHasCheckedProfile(true);
  }, []);

  useEffect(() => {
    setSelectedAnswer(null);
    setResult(null);
    setError(null);
    setShowCompletion(false);
    setCodeValue(exercise.starterCode);
    setTerminalOutput(emptyTerminal);
    setRuntimeError(null);
    setIsRunning(false);
  }, [exercise.id, exercise.starterCode]);

  async function submitAnswer(answer: string, selectedValue: string | null = answer) {
    if (!userId || result || isSubmitting) {
      return null;
    }

    setSelectedAnswer(selectedValue);
    setError(null);
    setIsSubmitting(true);

    try {
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

      if (!response.ok || !payload) {
        const errorPayload = payload as { error?: string } | null;
        setError(errorPayload?.error ?? "Die Antwort konnte gerade nicht gespeichert werden.");
        setSelectedAnswer(null);
        return null;
      }

      const progressResult = payload as ProgressResult;
      setResult(progressResult);
      return progressResult;
    } catch {
      setError("Die Antwort konnte gerade nicht gespeichert werden.");
      setSelectedAnswer(null);
      return null;
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleRunCode() {
    if (!userId || result || isSubmitting || isRunning) {
      return;
    }

    setError(null);
    setRuntimeError(null);
    setIsRunning(true);

    try {
      if (codeValue.includes("____")) {
        setRuntimeError("Da ist noch eine Lücke offen.");
        return;
      }

      if (editorLanguage === "python") {
        setTerminalOutput("Python startet...");
        const execution = await runPythonCode(codeValue);
        setTerminalOutput(execution.output || "(kein Text ausgegeben)");

        if (execution.error) {
          setRuntimeError(execution.error);
          return;
        }

        await submitAnswer(execution.output || " ", null);
        return;
      }

      setTerminalOutput("Vorschau geprüft.");
      await submitAnswer(codeValue.trim() || " ", null);
    } catch (caughtError) {
      const message = caughtError instanceof Error ? caughtError.message : "Pyodide konnte nicht gestartet werden.";
      setRuntimeError(message);
    } finally {
      setIsRunning(false);
    }
  }

  function handleNext() {
    if (!result) {
      return;
    }

    if (!result.correct) {
      setSelectedAnswer(null);
      setResult(null);
      setRuntimeError(null);
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
    const awardedBadges =
      result.badgesAwarded && result.badgesAwarded.length > 0
        ? result.badgesAwarded
        : result.badgeAwarded
          ? [result.badgeAwarded]
          : [];

    return (
      <div className="mx-auto grid min-h-[calc(100svh-8rem)] w-full max-w-4xl place-items-center px-6 py-10 sm:px-8 lg:px-10">
        <motion.section
          className="relative w-full overflow-hidden rounded-lg border border-primary/20 bg-card p-8 text-center shadow-sm"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <ConfettiBurst />
          <div className="mx-auto flex size-20 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Trophy className="size-10" aria-hidden="true" />
          </div>
          <p className="mt-6 text-sm font-semibold uppercase tracking-normal text-accent">Lektion abgeschlossen</p>
          <h1 className="mt-2 text-4xl font-semibold sm:text-5xl">{exercise.lesson.title}</h1>
          <motion.p
            className="mt-5 text-3xl font-semibold text-primary"
            initial={{ scale: 0.75, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 180, damping: 12, delay: 0.2 }}
          >
            +{result.xpEarned} XP
          </motion.p>
          {awardedBadges.length > 0 ? (
            <div className="mx-auto mt-6 grid max-w-2xl gap-3 sm:grid-cols-2">
              {awardedBadges.map((badge) => (
                <div key={badge.name} className="rounded-lg bg-accent/10 p-5">
                  <p className="text-4xl">{badge.icon}</p>
                  <p className="mt-2 text-xl font-semibold">{badge.name}</p>
                </div>
              ))}
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
          className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Zurück zur Theorie
        </Link>
      </div>

      <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
        <motion.main
          className="relative overflow-hidden rounded-apple-xl bg-card p-6 shadow-sm sm:p-8"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          {result?.correct ? <ConfettiBurst /> : null}

          <div className="flex flex-wrap items-center gap-3">
            <span className={cn("inline-flex rounded-full bg-gradient-to-r px-4 py-2 text-sm font-semibold", level.accentClass)}>
              {level.title}
            </span>
            <span className="inline-flex rounded-full bg-muted px-4 py-2 text-sm font-semibold text-muted-foreground">
              {getExerciseTypeLabel(exercise.type)}
            </span>
          </div>

          <div className="mt-7 space-y-3">
            <p className="text-sm font-semibold uppercase tracking-normal text-accent">
              {exercise.lesson.course.title} · {exercise.lesson.title}
            </p>
            <h1 className="text-4xl font-semibold text-foreground">Übung {exercise.order}</h1>
            <p className="text-lg leading-8 text-muted-foreground">{exercise.question}</p>
          </div>

          <div className="mt-6 h-1.5 overflow-hidden rounded-full bg-muted" role="progressbar" aria-valuenow={progressPercent} aria-valuemin={0} aria-valuemax={100} aria-label="Fortschritt">
            <motion.div
              className="h-full origin-left rounded-full bg-primary"
              initial={{ scaleX: Math.max(progressPercent - 12, 0) / 100 }}
              animate={{ scaleX: progressPercent / 100 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
            />
          </div>

          {!hasCheckedProfile ? (
            <div className="mt-8 h-40 animate-pulse rounded-lg bg-muted" />
          ) : !userId ? (
            <div className="mt-8 rounded-lg bg-muted p-5">
              <p className="font-semibold">Lege zuerst ein Profil an.</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Dann können XP, Badges und Fortschritt gespeichert werden.
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
                      "min-h-24 rounded-apple border border-border bg-card p-4 text-left text-base font-semibold transition disabled:cursor-default sm:text-lg",
                      "hover:border-primary hover:bg-primary/5",
                      isCorrectSelection &&
                        "border-apple-green bg-apple-green/10 text-emerald-700 dark:text-apple-green",
                      isWrongSelection && "border-apple-red bg-apple-red/10 text-red-700 dark:text-apple-red",
                      isCorrectAnswer &&
                        "border-apple-green bg-apple-green/10 text-emerald-700 dark:text-apple-green"
                    )}
                    disabled={Boolean(result) || isSubmitting}
                    aria-pressed={isSelected}
                    whileTap={{ scale: 0.96 }}
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
          ) : isCodeExercise ? (
            <CodePracticePanel
              exercise={exercise}
              language={editorLanguage}
              codeValue={codeValue}
              terminalOutput={terminalOutput}
              runtimeError={runtimeError}
              result={result}
              isBusy={isRunning || isSubmitting}
              onCodeChange={setCodeValue}
              onRunCode={() => void handleRunCode()}
            />
          ) : (
            <div className="mt-8 rounded-lg bg-muted p-5">
              <p className="font-semibold">Dieser Übungstyp ist noch nicht verfügbar.</p>
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
              <p className="text-xl font-semibold">{result.correct ? "Richtig!" : "Fast. Versuch es nochmal!"}</p>
              <p className="mt-2 text-sm font-bold">
                {result.correct
                  ? result.alreadyCompleted
                    ? "Diese Übung war schon erledigt, deshalb gibt es keine doppelten XP."
                    : `Du bekommst ${result.xpEarned} XP.`
                  : isMultipleChoice
                    ? "Der rote Knopf zeigt deine Auswahl. Die grüne Antwort hilft dir beim Lernen."
                    : "Schau in die Ausgabe und prüfe, ob dein Code genau das erwartete Ergebnis zeigt."}
              </p>
              <Button className="mt-5 h-11 px-5 text-base" onClick={handleNext}>
                {result.correct ? "Weiter" : "Nochmal probieren"}
                <ArrowRight className="size-5" aria-hidden="true" />
              </Button>
            </motion.div>
          ) : null}
        </motion.main>

        <aside className="space-y-4">
          <div className="rounded-apple-xl bg-card p-5 shadow-sm">
            <Sparkles className="size-7 text-primary" aria-hidden="true" />
            <p className="mt-4 text-sm font-semibold text-muted-foreground">Belohnung</p>
            <p className="text-3xl font-semibold">{exercise.xpReward} XP</p>
          </div>
          <div className="rounded-apple-xl bg-card p-5 shadow-sm">
            <BadgeCheck className="size-7 text-accent" aria-hidden="true" />
            <p className="mt-4 text-sm font-semibold text-muted-foreground">Fortschritt</p>
            <p className="text-3xl font-semibold">
              {result?.completedCount ?? Math.max(exercise.order - 1, 0)} / {exercise.totalExercises}
            </p>
          </div>
          <div className="rounded-apple-xl bg-card p-5 shadow-sm">
            <p className="text-sm font-semibold text-primary">Tipp</p>
            <p className="mt-2 leading-7 text-muted-foreground">{exercise.hint}</p>
          </div>
        </aside>
      </section>
    </div>
  );
}

type CodePracticePanelProps = {
  exercise: ExercisePreviewData;
  language: CodeLanguage;
  codeValue: string;
  terminalOutput: string;
  runtimeError: string | null;
  result: ProgressResult | null;
  isBusy: boolean;
  onCodeChange: (value: string) => void;
  onRunCode: () => void;
};

function CodePracticePanel({
  exercise,
  language,
  codeValue,
  terminalOutput,
  runtimeError,
  result,
  isBusy,
  onCodeChange,
  onRunCode,
}: CodePracticePanelProps) {
  const actionLabel = language === "python" ? "Ausführen" : "Prüfen";

  return (
    <div className="mt-8 grid gap-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Code2 className="size-6" aria-hidden="true" />
          </span>
          <div>
            <p className="text-sm font-semibold uppercase tracking-normal text-muted-foreground">
              {language === "python" ? "Python Editor" : "HTML Editor"}
            </p>
            <p className="font-semibold">{exercise.type === "CODE_GAP" ? "Lücke füllen" : "Eigener Code"}</p>
          </div>
        </div>
        <Button className="h-11 px-5 text-base" disabled={isBusy || Boolean(result)} onClick={onRunCode}>
          {isBusy ? <Loader2 className="size-5 animate-spin" aria-hidden="true" /> : <Play className="size-5" aria-hidden="true" />}
          {actionLabel}
        </Button>
      </div>

      <CodeEditor language={language} value={codeValue} onChange={onCodeChange} readOnly={Boolean(result?.correct)} />

      {language === "html" ? (
        <div className="rounded-lg border border-border bg-background p-4">
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-muted-foreground">
            <Monitor className="size-4" aria-hidden="true" />
            Vorschau
          </div>
          <iframe
            title="HTML Vorschau"
            sandbox=""
            srcDoc={codeValue}
            className="h-56 w-full rounded-lg border border-border bg-white"
          />
        </div>
      ) : null}

      <div className="rounded-lg border border-neutral-800 bg-neutral-950 p-4 text-neutral-100 shadow-sm">
        <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-neutral-300">
          <Terminal className="size-4" aria-hidden="true" />
          {language === "python" ? "Terminal" : "Prüfung"}
        </div>
        <pre
          className={cn(
            "min-h-20 whitespace-pre-wrap break-words font-mono text-sm leading-6",
            runtimeError ? "text-red-200" : "text-emerald-100"
          )}
        >
          {runtimeError ?? terminalOutput}
        </pre>
      </div>
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

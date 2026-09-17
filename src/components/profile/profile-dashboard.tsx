"use client";

import { Text, useLanguage } from "@/components/i18n/language-provider";
import { useEffect, useState } from "react";
import { localize } from "@/lib/localization";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { animate, motion } from "framer-motion";
import { ArrowRight, Award, BookOpen, Flame, Trophy } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { PROFILE_STORAGE_KEY } from "@/lib/storage-keys";
import { cn } from "@/lib/utils";

type DashboardData = {
  user: {
    id: string;
    username: string;
    avatar: string;
    xp: number;
    streak: number;
  };
  badges: {
    id: string;
    name: string;
    icon: string;
  }[];
  courseProgress: {
    id: string;
    title: string;
    level: string;
    completed: number;
    correct: number;
    total: number;
    percent: number;
  }[];
  levelUp: {
    beginnerComplete: boolean;
  };
};

export function ProfileDashboard() {
  const router = useRouter();
  const language = useLanguage();
  const [source, setData] = useState<DashboardData | null>(null);
  const data = localize(source, language);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const userId = window.localStorage.getItem(PROFILE_STORAGE_KEY);

    if (!userId) {
      router.replace("/profile/new");
      return;
    }

    async function loadProfile() {
      const response = await fetch(`/api/profile/${userId}`, {
        cache: "no-store",
      });

      if (response.status === 404) {
        window.localStorage.removeItem(PROFILE_STORAGE_KEY);
        router.replace("/profile/new");
        return;
      }

      if (!response.ok) {
        setError("Das Profil konnte gerade nicht geladen werden.");
        setIsLoading(false);
        return;
      }

      const profileData = (await response.json()) as DashboardData;
      setData(profileData);
      setIsLoading(false);
    }

    void loadProfile();
  }, [router]);

  if (isLoading) {
    return (
      <main className="mx-auto w-full max-w-6xl px-6 py-10 sm:px-8 lg:px-10">
        <div className="grid gap-4 md:grid-cols-3">
          {[0, 1, 2].map((item) => (
            <Skeleton key={item} className="h-36" />
          ))}
        </div>
        <Skeleton className="mt-8 h-80" />
      </main>
    );
  }

  if (error || !data) {
    return (
      <main className="mx-auto w-full max-w-4xl px-6 py-16 text-center sm:px-8 lg:px-10">
        <h1 className="text-3xl font-semibold"><Text message={"Profil nicht geladen"} /></h1>
        <p className="mt-3 text-muted-foreground"><Text message={error ?? "Bitte lege ein neues Profil an."} /></p>
        <Link href="/profile/new" className={cn(buttonVariants(), "mt-6 h-11 px-4")}><Text message={"Neues Profil"} />{" "}</Link>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-10 sm:px-8 lg:px-10">
      {data.levelUp.beginnerComplete ? (
        <motion.section
          className="mb-8 overflow-hidden rounded-lg border border-primary/20 bg-gradient-to-r from-primary/15 via-accent/10 to-emerald-400/15 p-6 shadow-sm"
          initial={{ opacity: 0, y: -14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <p className="text-sm font-semibold uppercase tracking-normal text-accent"><Text message={"Level-Up"} /></p>
          <div className="mt-2 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-3xl font-semibold"><Text message={"Du bist jetzt auf Intermediate!"} /></h2>
              <p className="mt-2 max-w-2xl text-muted-foreground"><Text message={"Alle Beginner-Übungen sind geschafft. Die nächsten Kurse sind freigeschaltet."} />{" "}</p>
            </div>
            <Link href="/courses/intermediate" className={cn(buttonVariants({ size: "lg" }), "h-12 px-5 text-base")}><Text message={"Weiter zum Level"} />{" "}<ArrowRight className="size-5" aria-hidden="true" />
            </Link>
          </div>
        </motion.section>
      ) : null}

      <section className="grid gap-4 md:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-apple-xl bg-card p-6 shadow-sm">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <div className="flex size-24 items-center justify-center rounded-lg bg-primary/10 text-6xl">
              {data.user.avatar}
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-normal text-accent"><Text message={"Profil"} /></p>
              <h1 className="text-4xl font-semibold">{data.user.username}</h1>
              <p className="mt-2 text-muted-foreground"><Text message={"Bereit für die nächste Coding-Mission."} /></p>
            </div>
          </div>
        </div>

        <div className="grid gap-4 min-[420px]:grid-cols-2">
          <div className="rounded-lg border border-primary/20 bg-primary/10 p-5">
            <Trophy className="size-7 text-primary" aria-hidden="true" />
            <p className="mt-4 text-sm font-semibold text-muted-foreground">XP</p>
            <p className="text-4xl font-semibold">
              <AnimatedNumber value={data.user.xp} />
            </p>
          </div>
          <div className="rounded-lg border border-accent/20 bg-accent/10 p-5">
            <Flame className="size-7 text-accent" aria-hidden="true" />
            <p className="mt-4 text-sm font-semibold text-muted-foreground"><Text message={"Streak"} /></p>
            <p className="text-4xl font-semibold">
              <AnimatedNumber value={data.user.streak} />
            </p>
          </div>
        </div>
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-[1fr_0.8fr]">
        <div className="rounded-apple-xl bg-card p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <BookOpen className="size-6 text-primary" aria-hidden="true" />
            <h2 className="text-2xl font-semibold"><Text message={"Kursfortschritt"} /></h2>
          </div>
          <div className="mt-6 space-y-5">
            {data.courseProgress.map((course) => (
              <div key={course.id} className="space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="font-semibold">{course.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {course.completed}{" "}<Text message={"von"} />{" "}{course.total}{" "}<Text message={"Übungen erledigt"} />{" "}</p>
                  </div>
                  <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-secondary-foreground">
                    {course.percent}%
                  </span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
                    style={{ width: `${course.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-apple-xl bg-card p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <Award className="size-6 text-accent" aria-hidden="true" />
            <h2 className="text-2xl font-semibold"><Text message={"Badges"} /></h2>
          </div>
          {data.badges.length === 0 ? (
            <p className="mt-6 rounded-md bg-muted p-4 text-sm font-bold text-muted-foreground"><Text message={"Noch keine Badges. Die erste Auszeichnung wartet nach deiner ersten abgeschlossenen Lektion."} />{" "}</p>
          ) : (
            <div className="mt-6 grid grid-cols-2 gap-3">
              {data.badges.map((badge) => (
                <div key={badge.id} className="rounded-md border border-border bg-background p-4">
                  <p className="text-3xl">{badge.icon}</p>
                  <p className="mt-2 font-semibold"><Text message={badge.name} /></p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <div className="mt-8">
        <Link href="/courses/beginner" className={cn(buttonVariants({ size: "lg" }), "h-12 px-5 text-base")}><Text message={"Weiterlernen"} />{" "}</Link>
      </div>
    </main>
  );
}

function AnimatedNumber({ value }: { value: number }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const controls = animate(0, value, {
      duration: 0.75,
      ease: "easeOut",
      onUpdate: (latest) => {
        setDisplayValue(Math.round(latest));
      },
    });

    return () => controls.stop();
  }, [value]);

  return <>{displayValue}</>;
}

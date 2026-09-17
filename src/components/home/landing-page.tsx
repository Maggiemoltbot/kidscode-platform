"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Crown, Rocket, Sparkles } from "lucide-react";
import { RobotMascot } from "@/components/mascot/robot-mascot";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { type LevelSlug } from "@/lib/level-config";
import { type LevelSummary } from "@/lib/course-queries";

type LandingPageProps = {
  levels: LevelSummary[];
};

const iconByLevel: Record<LevelSlug, typeof Sparkles> = {
  beginner: Sparkles,
  intermediate: Rocket,
  expert: Crown,
};

const cardToneByLevel: Record<LevelSlug, string> = {
  beginner: "bg-card",
  intermediate: "bg-card",
  expert: "bg-card",
};

const fadeInUp = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0 },
};

export function LandingPage({ levels }: LandingPageProps) {
  return (
    <div className="overflow-hidden">
      <section className="mx-auto grid min-h-[calc(100svh-8rem)] w-full max-w-6xl items-center gap-10 px-6 py-12 sm:px-8 md:grid-cols-[1.05fr_0.95fr] lg:px-10">
        <motion.div
          className="space-y-7"
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
            <Sparkles className="size-4" aria-hidden="true" />
            Lernen, probieren, Punkte sammeln
          </div>
          <div className="space-y-4">
            <h1 className="text-5xl font-semibold tracking-normal text-foreground sm:text-6xl lg:text-7xl">
              KidsCode
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-muted-foreground sm:text-xl">
              Programmieren lernen wie ein Abenteuer: kurze Lektionen, direkte Übungen und
              sichtbarer Fortschritt für junge Entdeckerinnen und Entdecker.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/courses/beginner"
              className={cn(buttonVariants({ size: "lg" }), "h-12 bg-primary px-5 text-base shadow-sm")}
            >
              Jetzt starten!
              <Rocket className="size-5" aria-hidden="true" />
            </Link>
            <Link
              href="/profile/new"
              className={cn(buttonVariants({ variant: "outline", size: "lg" }), "h-12 px-5 text-base")}
            >
              Profil anlegen
            </Link>
          </div>
        </motion.div>

        <motion.div
          className="flex justify-center"
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
        >
          <div className="relative flex aspect-square w-full max-w-[390px] items-center justify-center rounded-[2rem] border border-primary/10 bg-gradient-to-br from-primary/10 via-background to-accent/15 p-8 shadow-sm">
            <RobotMascot />
          </div>
        </motion.div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-6 pb-16 sm:px-8 lg:px-10">
        <div className="mb-7 flex flex-col gap-2">
          <p className="text-sm font-semibold uppercase tracking-normal text-accent">Wähle dein Level</p>
          <h2 className="text-3xl font-semibold text-foreground sm:text-4xl">Dein nächstes Coding-Abenteuer</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {levels.map((level, index) => {
            const Icon = iconByLevel[level.slug];

            return (
              <motion.div
                key={level.slug}
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.3, delay: index * 0.08, ease: "easeOut" }}
                whileHover={{ scale: 1.02 }}
              >
                <Link
                  href={`/courses/${level.slug}`}
                  className={cn(
                    "group flex h-full flex-col rounded-apple-xl p-6 shadow-sm transition-shadow duration-200 hover:shadow-md",
                    cardToneByLevel[level.slug]
                  )}
                >
                  <div className="flex items-center justify-between gap-4">
                    <span className="flex size-12 items-center justify-center rounded-lg bg-background text-primary shadow-sm">
                      <Icon className="size-6" aria-hidden="true" />
                    </span>
                    <span className="rounded-full bg-background px-3 py-1 text-sm font-semibold text-muted-foreground">
                      {level.lessonCount} Lektionen
                    </span>
                  </div>
                  <div className="mt-7 space-y-3">
                    <h3 className="text-2xl font-semibold text-foreground">{level.title}</h3>
                    <p className="min-h-20 text-sm leading-6 text-muted-foreground">{level.description}</p>
                  </div>
                  <div className="mt-auto flex items-center gap-2 pt-6 text-sm font-semibold text-primary">
                    Level öffnen
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

import { Level } from "@prisma/client";

export type LevelSlug = "beginner" | "intermediate" | "expert";

export type LevelConfig = {
  slug: LevelSlug;
  dbLevel: Level;
  title: string;
  shortTitle: string;
  description: string;
  accentClass: string;
};

export const levelOrder: LevelSlug[] = ["beginner", "intermediate", "expert"];

export const levelConfigs: Record<LevelSlug, LevelConfig> = {
  beginner: {
    slug: "beginner",
    dbLevel: Level.BEGINNER,
    title: "Beginner",
    shortTitle: "Beginner",
    description: "Erste Programme, HTML-Bausteine und spielerische Denkaufgaben.",
    accentClass: "from-primary/20 to-accent/20 text-primary",
  },
  intermediate: {
    slug: "intermediate",
    dbLevel: Level.INTERMEDIATE,
    title: "Intermediate",
    shortTitle: "Intermediate",
    description: "Schleifen, Funktionen, Listen und kleine Webseiten mit mehr Logik.",
    accentClass: "from-sky-400/20 to-primary/20 text-sky-700 dark:text-sky-300",
  },
  expert: {
    slug: "expert",
    dbLevel: Level.EXPERT,
    title: "Expert",
    shortTitle: "Expert",
    description: "Eigene Mini-Projekte, OOP-Grundlagen und ein erster Blick auf C.",
    accentClass: "from-accent/20 to-emerald-400/20 text-accent",
  },
};

export function getLevelConfig(slug: string) {
  return levelConfigs[slug as LevelSlug];
}

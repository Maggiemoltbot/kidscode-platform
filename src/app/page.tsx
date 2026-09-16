import Link from "next/link";
import { ArrowRight, BookOpen, Sparkles } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function Home() {
  return (
    <section className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-16 sm:px-8 lg:px-10 lg:py-24">
      <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-7">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-bold text-primary">
            <Sparkles className="size-4" aria-hidden="true" />
            M1 Grundgeruest ist bereit
          </div>
          <div className="space-y-4">
            <h1 className="max-w-3xl text-4xl font-black tracking-normal text-balance text-foreground sm:text-5xl lg:text-6xl">
              KidsCode macht Programmieren fuer Kinder greifbar.
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-muted-foreground">
              Das Projekt steht auf Next.js, Tailwind, shadcn/ui und Prisma. Die Kursdaten sind
              vorbereitet, damit die naechsten Meilensteine direkt Lernpfade und Uebungen bauen
              koennen.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/courses/beginner"
              className={cn(buttonVariants({ size: "lg" }), "h-12 bg-primary px-5 text-base")}
            >
              Kurse ansehen
              <ArrowRight className="size-5" aria-hidden="true" />
            </Link>
            <Link
              href="/profile"
              className={cn(buttonVariants({ variant: "outline", size: "lg" }), "h-12 px-5 text-base")}
            >
              Profil vorbereiten
            </Link>
          </div>
        </div>
        <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex size-12 items-center justify-center rounded-lg bg-accent text-2xl">
              <BookOpen className="size-6 text-accent-foreground" aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm font-bold uppercase text-muted-foreground">MVP-Pfad</p>
              <h2 className="text-2xl font-black">8 Meilensteine</h2>
            </div>
          </div>
          <div className="mt-6 grid gap-3">
            {["Projektaufbau", "Level-Auswahl", "Profil", "Lektionen", "Uebungen"].map((item) => (
              <div
                key={item}
                className="flex items-center justify-between rounded-md border border-border bg-background px-4 py-3"
              >
                <span className="font-bold">{item}</span>
                <span className="text-sm text-muted-foreground">geplant</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

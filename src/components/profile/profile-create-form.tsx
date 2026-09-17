"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Loader2, Sparkles } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { PROFILE_STORAGE_KEY } from "@/lib/storage-keys";
import { cn } from "@/lib/utils";

const avatars = ["🤖", "🦊", "🐼", "🦄", "🐸", "🐻"];

export function ProfileCreateForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [avatar, setAvatar] = useState(avatars[0]);
  const [existingUserId, setExistingUserId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setExistingUserId(window.localStorage.getItem(PROFILE_STORAGE_KEY));
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const response = await fetch("/api/profile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, avatar }),
    });

    const data = (await response.json()) as {
      user?: {
        id: string;
      };
      error?: string;
    };

    if (!response.ok || !data.user) {
      setError(data.error ?? "Das Profil konnte nicht gespeichert werden.");
      setIsSubmitting(false);
      return;
    }

    window.localStorage.setItem(PROFILE_STORAGE_KEY, data.user.id);
    router.push("/profile");
  }

  return (
    <main className="mx-auto grid w-full max-w-5xl gap-8 px-6 py-10 sm:px-8 md:grid-cols-[0.9fr_1.1fr] lg:px-10">
      <section className="space-y-5">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
          <Sparkles className="size-4" aria-hidden="true" />
          Dein Startprofil
        </div>
        <div className="space-y-4">
          <h1 className="text-4xl font-semibold sm:text-5xl">Wer lernt heute?</h1>
          <p className="text-lg leading-8 text-muted-foreground">
            Wähle einen Namen und einen Avatar. Es gibt kein Passwort, damit Kinder sofort starten
            können.
          </p>
        </div>
        {existingUserId ? (
          <Link href="/profile" className={cn(buttonVariants({ variant: "outline" }), "h-11 px-4")}>
            Vorhandenes Profil öffnen
          </Link>
        ) : null}
      </section>

      <form onSubmit={handleSubmit} className="rounded-apple-xl bg-card p-6 shadow-sm">
        <div className="space-y-6">
          <label className="block space-y-2">
            <span className="text-sm font-semibold text-foreground">Name</span>
            <input
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              maxLength={24}
              placeholder="z. B. Mia"
              className="h-12 w-full rounded-lg border border-input bg-background px-4 text-base font-bold outline-none transition focus:border-primary focus:ring-3 focus:ring-primary/20"
            />
          </label>

          <div className="space-y-3">
            <p className="text-sm font-semibold text-foreground">Avatar</p>
            <div className="grid grid-cols-3 gap-3">
              {avatars.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setAvatar(option)}
                  className={cn(
                    "aspect-square rounded-lg border text-4xl transition hover:-translate-y-1 hover:shadow-lg",
                    avatar === option
                      ? "border-primary bg-primary/10 ring-3 ring-primary/25"
                      : "border-border bg-background"
                  )}
                  aria-label={`Avatar ${option} auswählen`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          {error ? (
            <p className="rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm font-bold text-destructive">
              {error}
            </p>
          ) : null}

          <Button type="submit" size="lg" className="h-12 w-full text-base" disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="size-5 animate-spin" aria-hidden="true" /> : null}
            Los geht&apos;s!
            <ArrowRight className="size-5" aria-hidden="true" />
          </Button>
        </div>
      </form>
    </main>
  );
}

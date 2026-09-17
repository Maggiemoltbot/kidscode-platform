import { Text } from "@/components/i18n/language-provider";
import { Medal, Trophy } from "lucide-react";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Rangliste | KidsCode",
};

export default async function LeaderboardPage() {
  const users = await prisma.user.findMany({
    orderBy: [
      {
        xp: "desc",
      },
      {
        createdAt: "asc",
      },
    ],
    take: 10,
    select: {
      id: true,
      username: true,
      avatar: true,
      xp: true,
      streak: true,
      badges: {
        select: {
          id: true,
        },
      },
    },
  });

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-8 sm:py-10 lg:px-10">
      <section className="rounded-apple-xl bg-card p-5 shadow-sm sm:p-7">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-normal text-accent"><Text message={"Top 10"} /></p>
            <h1 className="mt-2 text-3xl font-semibold sm:text-5xl"><Text message={"Rangliste"} /></h1>
            <p className="mt-3 max-w-2xl text-muted-foreground"><Text message={"Die fleißigsten KidsCode-Profile nach gesammelten XP."} />{" "}</p>
          </div>
          <div className="flex size-14 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Trophy className="size-7" aria-hidden="true" />
          </div>
        </div>
      </section>

      <section className="mt-6 overflow-hidden rounded-apple-xl bg-card shadow-sm">
        {users.length === 0 ? (
          <div className="p-8 text-center">
            <Trophy className="mx-auto size-10 text-muted-foreground" aria-hidden="true" />
            <h2 className="mt-4 text-2xl font-semibold"><Text message={"Noch keine Profile"} /></h2>
            <p className="mt-2 text-muted-foreground"><Text message={"Sobald Kinder Übungen lösen, erscheint hier die Rangliste."} /></p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {users.map((user, index) => {
              const rank = index + 1;

              return (
                <article
                  key={user.id}
                  className="grid grid-cols-[auto_1fr] gap-4 p-4 sm:grid-cols-[auto_auto_1fr_auto] sm:items-center sm:p-5"
                >
                  <div className={getRankClassName(rank)}>
                    {rank <= 3 ? <Medal className="size-5" aria-hidden="true" /> : rank}
                  </div>
                  <div className="flex size-12 items-center justify-center rounded-lg bg-muted text-3xl">{user.avatar}</div>
                  <div className="min-w-0">
                    <h2 className="truncate text-lg font-semibold">{user.username}</h2>
                    <p className="text-sm font-bold text-muted-foreground">
                      {user.badges.length}{" "}<Text message={"Badges ·"} />{" "}{user.streak}{" "}<Text message={"Tage Streak"} />{" "}</p>
                  </div>
                  <div className="col-span-2 rounded-md bg-primary/10 px-4 py-3 text-right sm:col-span-1">
                    <p className="text-xs font-semibold uppercase tracking-normal text-primary">XP</p>
                    <p className="text-2xl font-semibold">{user.xp}</p>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}

function getRankClassName(rank: number) {
  const base = "flex size-10 items-center justify-center rounded-lg text-sm font-semibold";

  if (rank === 1) {
    return `${base} bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-200`;
  }

  if (rank === 2) {
    return `${base} bg-slate-100 text-slate-700 dark:bg-slate-900 dark:text-slate-200`;
  }

  if (rank === 3) {
    return `${base} bg-orange-100 text-orange-700 dark:bg-orange-950/40 dark:text-orange-200`;
  }

  return `${base} bg-muted text-muted-foreground`;
}

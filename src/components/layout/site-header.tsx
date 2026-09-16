import Link from "next/link";
import { Code2 } from "lucide-react";
import { ThemeToggle } from "@/components/layout/theme-toggle";

const navItems = [
  { href: "/courses/beginner", label: "Kurse" },
  { href: "/profile", label: "Profil" },
  { href: "/leaderboard", label: "Rangliste" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-8 lg:px-10">
        <Link href="/" className="flex items-center gap-3 font-black text-foreground">
          <span className="flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Code2 className="size-5" aria-hidden="true" />
          </span>
          <span className="text-xl">KidsCode</span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-bold text-muted-foreground sm:flex">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="transition-colors hover:text-foreground">
              {item.label}
            </Link>
          ))}
        </nav>
        <ThemeToggle />
      </div>
      <nav className="mx-auto flex h-11 w-full max-w-6xl items-center gap-2 overflow-x-auto px-4 pb-3 text-sm font-bold text-muted-foreground sm:hidden">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="rounded-full bg-muted px-3 py-1.5 transition-colors hover:text-foreground"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}

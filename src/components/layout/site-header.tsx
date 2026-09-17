"use client";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { LanguageSwitcher } from "@/components/i18n/language-provider";
import { Code2 } from "lucide-react";
import { ThemeToggle } from "@/components/layout/theme-toggle";

const navItems = [
  { href: "/courses/beginner", label: "courses" },
  { href: "/profile", label: "profile" },
  { href: "/leaderboard", label: "leaderboard" },
];

export function SiteHeader() {
  const t = useTranslations("nav");
  return (
    <header className="sticky top-0 z-30 border-b border-gray-200/50 bg-white/70 backdrop-blur-xl dark:border-white/10 dark:bg-[#1C1C1E]/70">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-8 lg:px-10">
        <Link href="/" className="flex items-center gap-3 font-semibold text-foreground">
          <span className="flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Code2 className="size-5" aria-hidden="true" />
          </span>
          <span className="hidden text-xl min-[390px]:inline">KidsCode</span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-bold text-muted-foreground sm:flex">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="transition-colors hover:text-foreground">
              {t(item.label)}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2"><LanguageSwitcher /><ThemeToggle /></div>
      </div>
      <nav className="mx-auto flex h-11 w-full max-w-6xl items-center gap-2 overflow-x-auto px-4 pb-3 text-sm font-bold text-muted-foreground sm:hidden">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="rounded-full bg-muted px-3 py-1.5 transition-colors hover:text-foreground"
          >
            {t(item.label)}
          </Link>
        ))}
      </nav>
    </header>
  );
}

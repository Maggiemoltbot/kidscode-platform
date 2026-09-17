"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ComponentProps } from "react";
import { MotionConfig } from "framer-motion";

export function ThemeProvider(props: ComponentProps<typeof NextThemesProvider>) {
  return <MotionConfig reducedMotion="user"><NextThemesProvider {...props} /></MotionConfig>;
}

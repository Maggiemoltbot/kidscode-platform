"use client";
import { useText } from "@/components/i18n/language-provider";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type RobotMascotProps = {
  className?: string;
};

export function RobotMascot({ className }: RobotMascotProps) {
  const tx = useText();
  return (
    <motion.svg
      className={cn("h-auto w-full max-w-[340px]", className)}
      viewBox="0 0 340 340"
      role="img"
      aria-label={tx("Freundlicher KidsCode Roboter")}
      initial={{ rotate: -2, y: 0 }}
      animate={{ rotate: [ -2, 2, -2 ], y: [0, -8, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
    >
      <defs>
        <linearGradient id="robotBody" x1="80" x2="260" y1="120" y2="280" gradientUnits="userSpaceOnUse">
          <stop stopColor="#7C3AED" />
          <stop offset="1" stopColor="#F97316" />
        </linearGradient>
        <linearGradient id="robotScreen" x1="100" x2="240" y1="118" y2="220" gradientUnits="userSpaceOnUse">
          <stop stopColor="#ffffff" />
          <stop offset="1" stopColor="#f5f3ff" />
        </linearGradient>
      </defs>
      <motion.circle
        cx="170"
        cy="172"
        r="136"
        fill="#F97316"
        opacity="0.11"
        animate={{ scale: [1, 1.04, 1] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
      />
      <path
        d="M103 138c0-30 24-54 54-54h26c30 0 54 24 54 54v78c0 36-29 65-65 65h-4c-36 0-65-29-65-65v-78Z"
        fill="url(#robotBody)"
      />
      <rect x="123" y="119" width="94" height="82" rx="24" fill="url(#robotScreen)" />
      <circle cx="151" cy="157" r="10" fill="#7C3AED" />
      <circle cx="189" cy="157" r="10" fill="#7C3AED" />
      <path d="M151 180c9 10 29 10 38 0" stroke="#F97316" strokeWidth="8" strokeLinecap="round" fill="none" />
      <path d="M170 84V58" stroke="#7C3AED" strokeWidth="10" strokeLinecap="round" />
      <circle cx="170" cy="45" r="14" fill="#F97316" />
      <path d="M102 164H72c-15 0-27 12-27 27v13" stroke="#7C3AED" strokeWidth="16" strokeLinecap="round" />
      <path d="M238 164h30c15 0 27 12 27 27v13" stroke="#F97316" strokeWidth="16" strokeLinecap="round" />
      <rect x="71" y="199" width="30" height="48" rx="15" fill="#ffffff" stroke="#7C3AED" strokeWidth="8" />
      <rect x="239" y="199" width="30" height="48" rx="15" fill="#ffffff" stroke="#F97316" strokeWidth="8" />
      <path d="M128 274h84" stroke="#241a3d" strokeWidth="14" strokeLinecap="round" opacity="0.18" />
      <circle cx="139" cy="234" r="8" fill="#fff7ed" opacity="0.9" />
      <circle cx="170" cy="238" r="8" fill="#fff7ed" opacity="0.9" />
      <circle cx="201" cy="234" r="8" fill="#fff7ed" opacity="0.9" />
    </motion.svg>
  );
}

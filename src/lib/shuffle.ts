// Fisher-Yates: neue Kopie, keine Änderung am übergebenen Array.
export function shuffleArray<T>(arr: readonly T[], random: () => number = Math.random): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function isOfferedOption(options: unknown, answer: string): boolean {
  return Array.isArray(options) && options.some((option) => typeof option === "string" && option === answer);
}

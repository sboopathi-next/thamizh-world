// Shared XP utility
export function getXPForLevel(level: number): number {
  return Math.floor(100 * Math.pow(1.2, level - 1));
}

export function getTotalXPForLevel(level: number): number {
  let total = 0;
  for (let i = 1; i < level; i++) total += getXPForLevel(i);
  return total;
}

// Motivational quotes
export const QUOTES = [
  "Discipline is stronger than motivation.",
  "Every page you read is a promise kept to your future self.",
  "Small steps every day lead to big results.",
  "You didn't come this far to only come this far.",
  "Work hard in silence, let success make the noise.",
  "Wake up determined, go to bed satisfied.",
  "Push yourself, because no one else is going to do it for you.",
  "Great things never come from comfort zones.",
  "Dream it. Believe it. Build it.",
  "One day or day one — you decide.",
];

export function getTodayQuote(): string {
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
  );
  return QUOTES[dayOfYear % QUOTES.length];
}

export function getTodayString(): string {
  return new Date().toISOString().split("T")[0];
}

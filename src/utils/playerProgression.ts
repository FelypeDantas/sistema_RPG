// utils/playerProgression.ts

export type Attributes = Record<string, number>;

/**
 * 1️⃣ XP Global
 * Soma todos os atributos.
 * Pode futuramente aplicar pesos diferentes.
 */
export function calculateGlobalXP(attributes: Attributes): number {
  return Object.values(attributes).reduce((acc, value) => acc + value, 0);
}

/**
 * 2️⃣ Curva de XP por nível
 * Fórmula: 100 * level²
 * Cria progressão crescente elegante.
 */
export function xpRequiredForLevel(level: number): number {
  return 100 * level * level;
}

/**
 * 3️⃣ Calcula Level com base no XP total
 */
export function calculateLevel(totalXP: number): number {
  let level = 1;

  while (totalXP >= xpRequiredForLevel(level + 1)) {
    level++;
  }

  return level;
}

/**
 * 4️⃣ Calcula progresso dentro do nível atual
 */
export function calculateLevelProgress(totalXP: number): number {
  const currentLevel = calculateLevel(totalXP);

  const currentLevelXP = xpRequiredForLevel(currentLevel);
  const nextLevelXP = xpRequiredForLevel(currentLevel + 1);

  const xpIntoLevel = totalXP - currentLevelXP;
  const xpRange = nextLevelXP - currentLevelXP;

  return (xpIntoLevel / xpRange) * 100;
}

/**
 * 5️⃣ Rank Global (E → S)
 */
export function getGlobalRank(level: number): string {
  if (level >= 100) return "S";
  if (level >= 70) return "A";
  if (level >= 40) return "B";
  if (level >= 20) return "C";
  if (level >= 10) return "D";
  return "E";
}
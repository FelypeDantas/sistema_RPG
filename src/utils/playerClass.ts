export type PlayerClass =
  | "Arquitet​o Mental"
  | "Vanguardista"
  | "Diplomata"
  | "Estrategista Financeiro"
  | "Polímata";

export function calculatePlayerClass(
  attributes: Record<string, number>
): PlayerClass {
  const entries = Object.entries(attributes);

  const sorted = entries.sort((a, b) => b[1] - a[1]);

  const [topKey, topValue] = sorted[0];
  const [, secondValue] = sorted[1];

  const difference = topValue - secondValue;

  // Se for muito equilibrado
  if (difference <= 5) return "Polímata";

  switch (topKey) {
    case "mente":
      return "Arquitet​o Mental";
    case "fisico":
      return "Vanguardista";
    case "social":
      return "Diplomata";
    case "financas":
      return "Estrategista Financeiro";
    default:
      return "Polímata";
  }
}

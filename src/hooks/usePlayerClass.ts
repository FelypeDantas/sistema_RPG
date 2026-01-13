export function usePlayerClass(player: any) {
  if (player.attributes.Mente >= 20) {
    return {
      title: "Mago do Código",
      rank: "Arcano",
      avatar: "🧙‍♂️"
    };
  }

  if (player.attributes.Físico >= 20) {
    return {
      title: "Guerreiro Urbano",
      rank: "Combatente",
      avatar: "🥊"
    };
  }

  return {
    title: "Dev Iniciante",
    rank: "Bronze",
    avatar: "🧑‍💻"
  };
}

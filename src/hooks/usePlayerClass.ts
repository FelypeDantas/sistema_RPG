export function usePlayerClass(player: any) {
  // fallback para atributos inexistentes
  const mente = player?.attributes?.Mente ?? 0;
  const fisico = player?.attributes?.Físico ?? 0;
  const social = player?.attributes?.Social ?? 0;
  const financas = player?.attributes?.Finanças ?? 0;

  // lista de classes ordenadas por prioridade
  const classes = [
    {
      condition: mente >= 20,
      title: "Mago do Código",
      rank: "Arcano",
      avatar: "🧙‍♂️"
    },
    {
      condition: fisico >= 20,
      title: "Guerreiro Urbano",
      rank: "Combatente",
      avatar: "🥊"
    },
    {
      condition: social >= 20,
      title: "Influencer Digital",
      rank: "Carismático",
      avatar: "📱"
    },
    {
      condition: financas >= 20,
      title: "Investidor Ninja",
      rank: "Estrategista",
      avatar: "💰"
    },
  ];

  const playerClass = classes.find(c => c.condition);

  return playerClass ?? {
    title: "Dev Iniciante",
    rank: "Bronze",
    avatar: "🧑‍💻"
  };
}

import { useMemo } from "react";
import { useMissions } from "@/hooks/useMissions";

export function useQuestAI() {
  const { history } = useMissions();

  return useMemo(() => {
    const attributes = {
      Mente: 0,
      Físico: 0,
      Social: 0,
      Finanças: 0,
    };

    history.forEach(h => {
      if (h.success) attributes[h.attribute] += h.xp;
    });

    const weakest = Object.entries(attributes).sort((a, b) => a[1] - b[1])[0][0];

    const suggestions = {
      Mente: [
        "Estudar 30 minutos focado",
        "Ler 10 páginas de um livro",
        "Resolver 5 problemas desafiadores"
      ],
      Físico: [
        "Treinar por 20 minutos",
        "Caminhar 3km",
        "Alongar por 15 minutos"
      ],
      Social: [
        "Iniciar conversa com alguém novo",
        "Responder mensagens pendentes",
        "Agendar encontro ou call"
      ],
      Finanças: [
        "Registrar gastos do dia",
        "Revisar orçamento semanal",
        "Pesquisar um investimento"
      ]
    };

    return suggestions[weakest as keyof typeof suggestions];
  }, [history]);
}

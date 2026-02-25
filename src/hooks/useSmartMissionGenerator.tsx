import { useMemo, useCallback } from "react";
import { Mission } from "@/hooks/useMissions";

type AttributeType = "Mente" | "Físico" | "Social" | "Finanças";

interface PlayerAttributes {
    Mente: number;
    Físico: number;
    Social: number;
    Finanças: number;
}

const MISSION_POOL: Record<AttributeType, string[]> = {
    Mente: [
        "Estudar 30 minutos",
        "Ler 10 páginas de um livro",
        "Resolver um problema difícil",
    ],
    Físico: [
        "Treinar por 20 minutos",
        "Caminhar 5 mil passos",
        "Alongamento completo",
    ],
    Social: [
        "Iniciar uma conversa nova",
        "Mandar mensagem para um amigo",
        "Networking estratégico",
    ],
    Finanças: [
        "Revisar gastos do dia",
        "Estudar investimentos",
        "Planejar orçamento semanal",
    ],
};

const getLowestAttribute = (attrs: PlayerAttributes): AttributeType => {
    return Object.entries(attrs).sort((a, b) => a[1] - b[1])[0][0] as AttributeType;
};

const calculateSmartXP = (
    lowestValue: number,
    highestValue: number
) => {
    const gap = highestValue - lowestValue;
    return Math.max(40, Math.min(200, 40 + gap * 5));
};

export const useSmartMissionGenerator = (
    attributes: PlayerAttributes
) => {
    const lowestAttr = useMemo(
        () => getLowestAttribute(attributes),
        [attributes]
    );

    const highestValue = Math.max(...Object.values(attributes));
    const lowestValue = attributes[lowestAttr];

    const generate = useCallback((): Mission => {
        const pool = MISSION_POOL[lowestAttr];
        const randomTitle =
            pool[Math.floor(Math.random() * pool.length)];

        const xp = calculateSmartXP(lowestValue, highestValue);

        return {
            id: crypto.randomUUID(),
            title: randomTitle,
            description: `Missão gerada para fortalecer ${lowestAttr}.`,
            xp,
            attribute: lowestAttr,
            completed: false,
            difficulty:
                xp >= 200
                    ? "epic"
                    : xp >= 100
                        ? "hard"
                        : xp >= 50
                            ? "medium"
                            : "easy",
            done: false,
            createdAt: Date.now(),
        };
    }, [lowestAttr, lowestValue, highestValue]);

    return { generate, lowestAttr };
};
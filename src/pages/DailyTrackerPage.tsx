// src/pages/DailyTrackerPage.tsx
import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from "recharts";

const tasks = [
  "Acordar entre 6 e 8h",
  "Treino físico",
  "Arrumar a casa",
  "Leitura por 30 minutos",
  "Meditação por 10 minutos",
  "Estudar por 50 minutos",
  "Pesquisar algo novo",
  "Socializar com alguém",
  "Cuidar das finanças por 15 minutos",
  "Dormir entre 22h e 00h"
];

type TaskData = { [key: string]: boolean };

const DailyTrackerPage = () => {
  const today = new Date().toISOString().split("T")[0];
  const [tasksState, setTasksState] = useState<TaskData>({});
  const [monthData, setMonthData] = useState<{ date: string; completed: number }[]>([]);

  // Inicializa ou reseta mês
  useEffect(() => {
    const currentMonth = new Date().getMonth();
    const savedMonth = localStorage.getItem("trackerMonth");
    if (!savedMonth || Number(savedMonth) !== currentMonth) {
      localStorage.setItem("trackerMonth", String(currentMonth));
      localStorage.setItem("trackerData", JSON.stringify([]));
      setMonthData([]);
    } else {
      const savedData = JSON.parse(localStorage.getItem("trackerData") || "[]");
      setMonthData(savedData);
    }
  }, []);

  // Carrega dados do dia
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem(today) || "{}");
    setTasksState(saved);
  }, [today]);

  const toggleTask = (task: string) => {
    const newState = { ...tasksState, [task]: !tasksState[task] };
    setTasksState(newState);
    localStorage.setItem(today, JSON.stringify(newState));

    // Atualiza dados mensais
    const completedCount = Object.values(newState).filter(Boolean).length;
    const newMonthData = monthData.filter(d => d.date !== today);
    newMonthData.push({ date: today, completed: completedCount });
    setMonthData(newMonthData);
    localStorage.setItem("trackerData", JSON.stringify(newMonthData));
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Acompanhamento Diário</h1>
      <div className="mb-6">
        <h2 className="font-semibold mb-2">Checklist de Hoje ({today})</h2>
        {tasks.map(task => (
          <label key={task} className="flex items-center mb-1">
            <input
              type="checkbox"
              checked={!!tasksState[task]}
              onChange={() => toggleTask(task)}
              className="mr-2"
            />
            {task}
          </label>
        ))}
      </div>

      <div className="flex gap-6">
        <div>
          <h2 className="font-semibold mb-2">Tarefas Concluídas no Mês</h2>
          <BarChart width={400} height={200} data={monthData}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="completed" fill="#4ade80" />
          </BarChart>
        </div>

        <div>
          <h2 className="font-semibold mb-2">Progresso do Mês</h2>
          <PieChart width={200} height={200}>
            <Pie
              data={[
                { name: "Concluídas", value: monthData.reduce((a, b) => a + b.completed, 0) },
                {
                  name: "Pendentes",
                  value: monthData.length * tasks.length - monthData.reduce((a, b) => a + b.completed, 0)
                }
              ]}
              dataKey="value"
              outerRadius={80}
              fill="#8884d8"
              label
            >
              <Cell fill="#4ade80" />
              <Cell fill="#f87171" />
            </Pie>
          </PieChart>
        </div>
      </div>
    </div>
  );
};

export default DailyTrackerPage;
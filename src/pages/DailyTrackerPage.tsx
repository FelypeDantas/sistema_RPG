// src/pages/DailyTrackerPage.tsx
import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();
  const today = new Date().toISOString().split("T")[0];
  const [tasksState, setTasksState] = useState<TaskData>({});
  const [monthData, setMonthData] = useState<{ date: string; completed: number }[]>([]);
  const [showResetNotice, setShowResetNotice] = useState(false);
  const [flashTask, setFlashTask] = useState<string | null>(null);

  // Inicializa ou reseta mês com animação neon
  useEffect(() => {
    const currentMonth = new Date().getMonth();
    const savedMonth = localStorage.getItem("trackerMonth");

    if (!savedMonth || Number(savedMonth) !== currentMonth) {
      // Reset do mês
      localStorage.setItem("trackerMonth", String(currentMonth));
      localStorage.setItem("trackerData", JSON.stringify([]));
      setMonthData([]);
      setShowResetNotice(true);

      // Esconde aviso após 3 segundos
      setTimeout(() => setShowResetNotice(false), 3000);
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

    // Flash neon na tarefa marcada
    setFlashTask(task);
    setTimeout(() => setFlashTask(null), 400);

    // Atualiza dados mensais
    const completedCount = Object.values(newState).filter(Boolean).length;
    const newMonthData = monthData.filter(d => d.date !== today);
    newMonthData.push({ date: today, completed: completedCount });
    setMonthData(newMonthData);
    localStorage.setItem("trackerData", JSON.stringify(newMonthData));
  };

  const totalCompleted = monthData.reduce((a, b) => a + b.completed, 0);
  const totalTasksInMonth = monthData.length * tasks.length;

  return (
    <div className="min-h-screen bg-cyber-dark p-6 relative">
      {/* Voltar ao Dashboard */}
      <button
        onClick={() => navigate("/")}
        className="mb-6 px-4 py-2 bg-neon-blue hover:bg-neon-blue/70 text-white font-semibold rounded-xl shadow-lg transition-all duration-200 tracking-wide"
      >
        ← Voltar ao Dashboard
      </button>

      {/* Aviso de Reset Mensal */}
      <AnimatePresence>
        {showResetNotice && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.9 }}
            className="absolute top-16 left-1/2 -translate-x-1/2 px-6 py-3 rounded-xl bg-neon-purple text-white font-bold shadow-xl text-lg z-50 tracking-wider"
          >
            🌙 Novo mês iniciado! Boa sorte!
          </motion.div>
        )}
      </AnimatePresence>

      <h1 className="text-3xl font-bold text-white mb-6 tracking-wide">Acompanhamento Diário</h1>

      {/* CHECKLIST */}
      <div className="bg-cyber-card p-6 rounded-2xl shadow-lg mb-6">
        <h2 className="text-neon-yellow font-bold text-xl mb-4">Checklist de Hoje ({today})</h2>
        <ul className="space-y-2">
          {tasks.map(task => (
            <li key={task} className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={!!tasksState[task]}
                onChange={() => toggleTask(task)}
                className="accent-neon-yellow w-5 h-5"
              />
              <motion.span
                className={`text-white ${tasksState[task] ? "line-through opacity-70" : ""}`}
                animate={flashTask === task ? { textShadow: "0 0 8px #facc15, 0 0 16px #facc15" } : {}}
                transition={{ duration: 0.4 }}
              >
                {task}
              </motion.span>
            </li>
          ))}
        </ul>
      </div>

      {/* GRÁFICOS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Barras mensais */}
        <div className="bg-cyber-card p-6 rounded-2xl shadow-lg">
          <h2 className="text-neon-green font-bold text-xl mb-4">Tarefas Concluídas no Mês</h2>
          <BarChart width={400} height={220} data={monthData}>
            <XAxis dataKey="date" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip
              contentStyle={{ backgroundColor: "#1f2937", borderRadius: 8, border: "none" }}
              itemStyle={{ color: "#facc15" }}
            />
            <Bar dataKey="completed" fill="#facc15" radius={[6, 6, 0, 0]} />
          </BarChart>
        </div>

        {/* Pizza progresso */}
        <div className="bg-cyber-card p-6 rounded-2xl shadow-lg flex flex-col items-center">
          <h2 className="text-neon-pink font-bold text-xl mb-4">Progresso do Mês</h2>
          <PieChart width={200} height={200}>
            <Pie
              data={[
                { name: "Concluídas", value: totalCompleted },
                { name: "Pendentes", value: totalTasksInMonth - totalCompleted }
              ]}
              dataKey="value"
              outerRadius={80}
              label
            >
              <Cell fill="#facc15" />
              <Cell fill="#f472b6" />
            </Pie>
          </PieChart>
          <span className="text-white font-semibold mt-2">
            {Math.round((totalCompleted / Math.max(totalTasksInMonth, 1)) * 100)}% concluído
          </span>
        </div>
      </div>
    </div>
  );
};

export default DailyTrackerPage;
import { useState, useEffect, useMemo } from "react";
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

  // Inteligência: estatísticas por tarefa
  const taskStats = useMemo(() => {
    const stats: Record<string, number> = {};
    tasks.forEach(task => {
      const count = monthData.filter(d => JSON.parse(localStorage.getItem(d.date) || "{}")[task]).length;
      stats[task] = count;
    });
    return stats;
  }, [monthData]);

  // Reset mensal
  useEffect(() => {
    const currentMonth = new Date().getMonth();
    const savedMonth = localStorage.getItem("trackerMonth");

    if (!savedMonth || Number(savedMonth) !== currentMonth) {
      localStorage.setItem("trackerMonth", String(currentMonth));
      localStorage.setItem("trackerData", JSON.stringify([]));
      setMonthData([]);
      setShowResetNotice(true);
      setTimeout(() => setShowResetNotice(false), 3500);
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

    // Flash neon
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
  const totalTasksInMonth = monthData.length * tasks.length || 1;

  // Sugestões inteligentes
  const recommendations = tasks.filter(task => taskStats[task] < 2 && !tasksState[task]);

  return (
    <div className="min-h-screen bg-cyber-dark p-6 relative overflow-hidden">
      {/* Fundo animado */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-b from-neon-blue/10 via-neon-purple/10 to-neon-pink/10"
        animate={{ y: ["0%", "100%"] }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
      />

      {/* Voltar */}
      <motion.button
        onClick={() => navigate("/")}
        className="mb-6 px-5 py-2 bg-neon-blue hover:bg-neon-blue/70 text-white font-bold rounded-xl shadow-neon tracking-wide"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        ← Voltar
      </motion.button>

      {/* Aviso reset */}
      <AnimatePresence>
        {showResetNotice && (
          <motion.div
            initial={{ opacity: 0, y: -60, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -60, scale: 0.9 }}
            transition={{ duration: 0.5 }}
            className="absolute top-16 left-1/2 -translate-x-1/2 px-6 py-3 rounded-xl bg-neon-purple text-white font-bold shadow-neon text-lg z-50 tracking-wider"
          >
            🌙 Novo mês iniciado! Boa sorte!
          </motion.div>
        )}
      </AnimatePresence>

      <h1 className="text-3xl font-bold text-white mb-6 tracking-wide text-neon-glow">
        Acompanhamento Diário
      </h1>

      {/* Checklist diário */}
      <motion.div
        className="bg-cyber-card p-6 rounded-2xl shadow-neon mb-6 relative overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-neon-yellow font-bold text-xl mb-4 glow-neon">
          Checklist de Hoje ({today})
        </h2>
        <ul className="space-y-3">
          {tasks.map(task => (
            <li key={task} className="flex items-center gap-3">
              <motion.input
                type="checkbox"
                checked={!!tasksState[task]}
                onChange={() => toggleTask(task)}
                className="w-5 h-5 cursor-pointer accent-neon-yellow hover:scale-110 transition-all"
                whileTap={{ scale: 0.95 }}
              />
              <motion.span
                className={`text-white ${tasksState[task] ? "line-through opacity-70" : ""} cursor-pointer
                  ${taskStats[task] < 2 && !tasksState[task] ? "text-neon-red font-semibold" : ""}`}
                animate={flashTask === task ? { textShadow: "0 0 8px #facc15, 0 0 16px #facc15" } : {}}
                transition={{ duration: 0.4 }}
              >
                {task}
              </motion.span>
            </li>
          ))}
        </ul>

        {/* Recomendações */}
        {recommendations.length > 0 && (
          <motion.div
            className="mt-4 p-3 rounded-xl bg-neon-red/20 text-neon-red font-semibold tracking-wide"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            💡 Sugestido hoje: {recommendations.join(", ")}
          </motion.div>
        )}
      </motion.div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          className="bg-cyber-card p-6 rounded-2xl shadow-neon relative overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <h2 className="text-neon-green font-bold text-xl mb-4 glow-neon">Tarefas Concluídas no Mês</h2>
          <BarChart width={400} height={220} data={monthData}>
            <XAxis dataKey="date" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip
              contentStyle={{ backgroundColor: "#1f2937", borderRadius: 8, border: "none" }}
              itemStyle={{ color: "#facc15" }}
            />
            <Bar dataKey="completed" fill="#facc15" radius={[6, 6, 0, 0]} />
          </BarChart>
        </motion.div>

        <motion.div
          className="bg-cyber-card p-6 rounded-2xl shadow-neon flex flex-col items-center relative overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="text-neon-pink font-bold text-xl mb-4 glow-neon">Progresso do Mês</h2>
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
          <motion.span
            className="text-white font-semibold mt-2 glow-neon"
            animate={{ textShadow: ["0 0 4px #facc15", "0 0 12px #facc15", "0 0 4px #facc15"] }}
            transition={{ repeat: Infinity, duration: 1.2 }}
          >
            {Math.round((totalCompleted / totalTasksInMonth) * 100)}% concluído
          </motion.span>
        </motion.div>
      </div>
    </div>
  );
};

export default DailyTrackerPage;
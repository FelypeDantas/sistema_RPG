import { useAuthWithPlayer } from "@/hooks/useAuth";
import RPGDashboardContent from "@/components/rpg/RPGDashboardContent";
import { AuthPage } from "./AuthPage";
import { motion } from "framer-motion";

const Loader = () => (
  <div className="min-h-screen flex items-center justify-center bg-cyber-dark">
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="bg-cyber-card border border-white/10 rounded-2xl px-10 py-8 flex flex-col items-center gap-6 shadow-neon"
    >
      <motion.div
        className="w-12 h-12 rounded-full border-2 border-neon-cyan border-t-transparent"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
      />
      <motion.p
        initial={{ opacity: 0.5 }}
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
        className="text-sm text-gray-400 tracking-wide"
      >
        Inicializando sistema...
      </motion.p>
    </motion.div>
  </div>
);

const RPGDashboard = () => {
  const { user, loading } = useAuthWithPlayer();

  if (loading) return <Loader />;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen bg-cyber-dark"
    >
      {user ? <RPGDashboardContent /> : <AuthPage />}
    </motion.div>
  );
};

export default RPGDashboard;
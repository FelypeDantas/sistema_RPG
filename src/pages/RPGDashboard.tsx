import { useAuthWithPlayer } from "@/hooks/useAuth";
import RPGDashboardContent from "@/components/rpg/RPGDashboardContent";
import { AuthPage } from "./AuthPage";
import { motion } from "framer-motion";

const RPGDashboard = () => {
  const { user, loading } = useAuthWithPlayer();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cyber-dark">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-cyber-card border border-white/10 rounded-2xl px-8 py-6 flex flex-col items-center gap-4"
        >
          <motion.div
            className="w-10 h-10 rounded-full border-2 border-neon-cyan border-t-transparent"
            animate={{ rotate: 360 }}
            transition={{
              repeat: Infinity,
              duration: 1,
              ease: "linear"
            }}
          />

          <motion.p
            initial={{ opacity: 0.5 }}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{
              repeat: Infinity,
              duration: 1.5
            }}
            className="text-sm text-gray-400 tracking-wide"
          >
            Inicializando sistema...
          </motion.p>
        </motion.div>
      </div>
    );
  }

  return user ? <RPGDashboardContent /> : <AuthPage />;
};

export default RPGDashboard;

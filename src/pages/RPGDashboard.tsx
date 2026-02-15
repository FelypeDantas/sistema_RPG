import { useAuthWithPlayer } from "@/hooks/useAuth";
import RPGDashboardContent from "@/components/rpg/RPGDashboardContent";
import { AuthPage } from "./AuthPage";

const RPGDashboard = () => {
  const { user, loading } = useAuthWithPlayer();

  if (loading) return <div>Carregando...</div>;

  return user ? <RPGDashboardContent /> : <AuthPage />;
};

export default RPGDashboard;

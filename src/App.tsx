import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import RPGDashboard from "./pages/RPGDashboard";
import NotFound from "./pages/NotFound";
import QuestHistory from "./pages/QuestHistory";
import TalentsTree from "./pages/TalentsTree";
import AttributesPage from "@/pages/AttributesPage";

// 👉 NOVO
import { PlayerProvider } from "@/context/PlayerContext";
import { AuthPage } from "./pages/AuthPage";
import DailyTrackerPage from "./pages/DailyTrackerPage";
import { HallOfGlory } from "./pages/HallOfGlory";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    {/* 👉 O PlayerProvider entra AQUI */}
    <PlayerProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />

        <BrowserRouter>
          <Routes>
            <Route path="login" element={<AuthPage />} />
            <Route path="/" element={<RPGDashboard />} />
            <Route path="/quests/history" element={<QuestHistory />} />
            <Route path="/talents" element={<TalentsTree />} />
            <Route path="/attributes" element={<AttributesPage />} />
            <Route path="/daily-tracker" element={<DailyTrackerPage />} />
            <Route path="/hall-of-glory" element={<HallOfGlory />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </PlayerProvider>
  </QueryClientProvider>
);

export default App;

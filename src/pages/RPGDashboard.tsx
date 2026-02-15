import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useUserData } from "@/hooks/useUserData";
import { RPGDashboardContent } from "@/components/rpg/RPGDashboardContent";
import { AuthPage } from "./AuthPage";

export default function RPGDashboard() {
  const { user, loading } = useAuth();
  const { data, saveData } = useUserData();

  if (loading) return <p>Carregando...</p>;
  if (!user) return <AuthPage />;

  return <RPGDashboardContent playerData={data} saveData={saveData} />;
}

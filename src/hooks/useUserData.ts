import { useEffect, useState, useCallback } from "react";
import { db } from "@/services/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useAuthWithPlayer } from "./useAuth";

/* =============================
   🔹 HOOK DE DADOS DO USUÁRIO
============================= */

export function useUserData() {
  const { user } = useAuthWithPlayer();

  const [data, setData] = useState({
    missions: [] as any[],
    level: 1,
    xp: 0,
    attributes: { Físico: 10, Mente: 10, Social: 10, Finanças: 10 },
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /* =============================
     ☁️ CARREGAR DADOS
  ============================= */
  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setData(docSnap.data() as typeof data);
        }
      } catch (err: any) {
        console.error("Erro ao carregar dados do usuário:", err);
        setError(err.message ?? "Erro desconhecido");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  /* =============================
     💾 SALVAR DADOS
  ============================= */
  const saveData = useCallback(
    async (newData: Partial<typeof data>) => {
      if (!user) return;

      const mergedData = { ...data, ...newData }; // merge localmente
      setData(mergedData);

      try {
        const docRef = doc(db, "users", user.uid);
        await setDoc(docRef, mergedData, { merge: true });
      } catch (err: any) {
        console.error("Erro ao salvar dados do usuário:", err);
        setError(err.message ?? "Erro desconhecido");
      }
    },
    [user, data]
  );

  /* =============================
     📦 API DO HOOK
  ============================= */
  return {
    data,
    saveData,
    loading,
    error
  };
}

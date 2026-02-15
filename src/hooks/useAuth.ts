import { useEffect, useState } from "react";
import { auth, db } from "@/services/firebase";
import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

interface PlayerData {
  level: number;
  xp: number;
  streak: number;
  attributes: Record<string, number>;
  missions: { id: string; completed: boolean }[];
}

export function useAuthWithPlayer() {
  const [user, setUser] = useState<User | null>(null);
  const [playerData, setPlayerData] = useState<PlayerData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        // Carregar dados do jogador
        const docRef = doc(db, "users", u.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setPlayerData(docSnap.data() as PlayerData);
        } else {
          // Criar dados iniciais do jogador se não existir
          setPlayerData({
            level: 1,
            xp: 0,
            streak: 0,
            attributes: { Forca: 5, Mente: 5, Fisico: 5 },
            missions: [],
          });
        }
      } else {
        setPlayerData(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (e: any) {
      setError(e.message);
    }
  };

  const register = async (email: string, password: string) => {
    setError(null);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      // Criar dados iniciais do jogador
      const docRef = doc(db, "users", cred.user.uid);
      await setDoc(docRef, {
        level: 1,
        xp: 0,
        streak: 0,
        attributes: { Forca: 5, Mente: 5, Fisico: 5 },
        missions: [],
      });
    } catch (e: any) {
      setError(e.message);
    }
  };

  const logout = async () => {
    await signOut(auth);
  };

  return { user, playerData, loading, error, login, register, logout, setPlayerData };
}

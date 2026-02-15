import { useEffect, useState, useCallback } from "react";
import { auth, db } from "@/services/firebase";
import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

interface PlayerData {
  level: number;
  xp: number;
  streak: number;
  attributes: Record<string, number>;
  missions: { id: string; completed: boolean }[];
}

const INITIAL_PLAYER_DATA: PlayerData = {
  level: 1,
  xp: 0,
  streak: 0,
  attributes: { Forca: 5, Mente: 5, Fisico: 5 },
  missions: [],
};

export function useAuthWithPlayer() {
  const [user, setUser] = useState<User | null>(null);
  const [playerData, setPlayerData] = useState<PlayerData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPlayerData = useCallback(async (uid: string) => {
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      setPlayerData(docSnap.data() as PlayerData);
    } else {
      // Criar dados iniciais
      await setDoc(docRef, INITIAL_PLAYER_DATA);
      setPlayerData(INITIAL_PLAYER_DATA);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      if (!isMounted) return;
      setUser(u);
      setLoading(true);

      if (u) {
        await fetchPlayerData(u.uid);
      } else {
        setPlayerData(null);
      }

      setLoading(false);
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [fetchPlayerData]);

  const login = useCallback(async (email: string, password: string) => {
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (e: any) {
      setError(e.message);
    }
  }, []);

  const register = useCallback(async (email: string, password: string) => {
    setError(null);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      const docRef = doc(db, "users", cred.user.uid);
      await setDoc(docRef, INITIAL_PLAYER_DATA);
      setPlayerData(INITIAL_PLAYER_DATA);
    } catch (e: any) {
      setError(e.message);
    }
  }, []);

  const logout = useCallback(async () => {
    setError(null);
    try {
      await signOut(auth);
    } catch (e: any) {
      setError(e.message);
    }
  }, []);

  return {
    user,
    playerData,
    loading,
    error,
    login,
    register,
    logout,
    setPlayerData,
    refresh: user ? () => fetchPlayerData(user.uid) : undefined,
  };
}

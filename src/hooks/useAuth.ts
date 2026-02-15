import { useEffect, useState } from "react";
import {
  getAuth,
  onAuthStateChanged,
  signInAnonymously,
  User
} from "firebase/auth";


import { initializeApp } from "firebase/app";

/* ⚠️ IMPORTANTE
   Se você já inicializa o Firebase em services/firebase.ts,
   importe o app de lá em vez de inicializar aqui.
*/

import { app } from "@/services/firebase";

const auth = getAuth(app);

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async currentUser => {
      if (currentUser) {
        setUser(currentUser);
        setLoading(false);
      } else {
        try {
          const result = await signInAnonymously(auth);
          setUser(result.user);
        } catch (error) {
          console.error("Erro ao autenticar:", error);
        } finally {
          setLoading(false);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  return { user, loading };
}

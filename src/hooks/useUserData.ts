import { useEffect, useState } from "react";
import { db } from "@/services/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useAuth } from "./useAuth";

export function useUserData() {
  const { user } = useAuth();
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) setData(docSnap.data());
      else setData({});
    };

    fetchData();
  }, [user]);

  const saveData = async (newData: any) => {
    if (!user) return;
    const docRef = doc(db, "users", user.uid);
    await setDoc(docRef, newData, { merge: true });
    setData(newData);
  };

  return { data, saveData };
}

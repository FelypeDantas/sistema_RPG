// database.ts
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "./firebase";

// Salva dados do usuário
export async function saveUserData(userId: string, data: any) {
  const docRef = doc(db, "users", userId);
  await setDoc(docRef, data, { merge: true });
}

// Carrega dados do usuário
export async function loadUserData(userId: string) {
  const docRef = doc(db, "users", userId);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? docSnap.data() : null;
}

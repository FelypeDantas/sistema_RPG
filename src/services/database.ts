import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "./firebase";

export async function saveUserData(userId: string, data: any) {
  await setDoc(doc(db, "users", userId), data);
}

export async function loadUserData(userId: string) {
  const snap = await getDoc(doc(db, "users", userId));
  return snap.exists() ? snap.data() : null;
}

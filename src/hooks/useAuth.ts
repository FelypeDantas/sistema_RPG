// src/services/auth.ts
import { httpsCallable } from "firebase/functions";
import { functions, auth } from "@/services/firebase";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";

interface CreateUserData {
  email: string;
  password: string;
}

// Chama Cloud Function para criar usuário
export async function createUser(data: CreateUserData) {
  const createUserCallable = httpsCallable(functions, "createUser");
  try {
    const result = await createUserCallable(data);
    return result.data; // { uid, email }
  } catch (err: any) {
    console.error("Erro ao criar usuário:", err);
    throw err;
  }
}

// Login padrão com Firebase Auth
export async function loginUser(email: string, password: string) {
  return signInWithEmailAndPassword(auth, email, password);
}

// Logout
export async function logoutUser() {
  return signOut(auth);
}

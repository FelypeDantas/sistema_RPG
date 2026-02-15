// services/auth.ts
import { httpsCallable } from "firebase/functions";
import { functions } from "../services/firebase";

interface CreateUserData {
  email: string;
  password: string;
}

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

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";

export function AuthPage() {
  const { user, login, register, error, loading } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  if (loading) return <p>Carregando...</p>;
  if (user) return <p>Bem-vindo, {user.email}!</p>;

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-900 text-white p-4">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4">{isRegister ? "Registrar" : "Login"}</h1>

        {error && <p className="text-red-500 mb-2">{error}</p>}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 mb-3 rounded bg-gray-700 text-white"
        />

        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 mb-4 rounded bg-gray-700 text-white"
        />

        <button
          onClick={() => (isRegister ? register(email, password) : login(email, password))}
          className="w-full bg-blue-600 hover:bg-blue-700 p-2 rounded mb-3"
        >
          {isRegister ? "Registrar" : "Login"}
        </button>

        <button
          onClick={() => setIsRegister(!isRegister)}
          className="w-full text-sm text-blue-400 hover:underline"
        >
          {isRegister ? "Já tem conta? Faça login" : "Não tem conta? Registrar"}
        </button>
      </div>
    </div>
  );
}

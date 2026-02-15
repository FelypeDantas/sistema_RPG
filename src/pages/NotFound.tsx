import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const STORAGE_KEY = "breach_attempts";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [attempts, setAttempts] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [secretUnlocked, setSecretUnlocked] = useState(false);
  const [keySequence, setKeySequence] = useState("");

  const fullMessage = `> tentativa_de_acesso: ${location.pathname}
> status: ACCESS_DENIED
> tentativas_detectadas: ${attempts}
> protocolo: MONITORAMENTO_ATIVO`;

  // Contador persistente
  useEffect(() => {
    const stored = Number(localStorage.getItem(STORAGE_KEY)) || 0;
    const newCount = stored + 1;
    localStorage.setItem(STORAGE_KEY, String(newCount));
    setAttempts(newCount);
  }, [location.pathname]);

  // Digitação
  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setDisplayedText(fullMessage.slice(0, i));
      i++;
      if (i > fullMessage.length) clearInterval(interval);
    }, 25);

    return () => clearInterval(interval);
  }, [attempts]);

  // Easter egg: digitar "override"
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const updated = (keySequence + e.key).slice(-8);
      setKeySequence(updated);

      if (updated.toLowerCase().includes("override")) {
        setSecretUnlocked(true);
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [keySequence]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-black text-green-400 font-mono p-6 relative overflow-hidden">

      <div className="absolute top-0 left-0 w-full h-1 bg-green-400/20 animate-scan" />

      <div className="relative max-w-2xl w-full">

        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-7xl font-bold text-red-500 relative glitch mb-6 text-center"
          data-text="404"
        >
          404
        </motion.h1>

        <div className="border border-green-500/30 bg-green-500/5 p-6 rounded-xl">
          <pre className="text-sm whitespace-pre-wrap">
            {displayedText}
            <span className="animate-pulse">▌</span>
          </pre>

          {attempts >= 3 && !secretUnlocked && (
            <p className="mt-4 text-yellow-400 text-xs text-center">
              sistema_detectou_comportamento_anomalo...
            </p>
          )}

          {secretUnlocked && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-6 p-4 border border-cyan-400/40 bg-cyan-500/10 rounded-lg text-center"
            >
              <p className="text-cyan-400 mb-2">
                OVERRIDE ACCEPTED
              </p>
              <button
                onClick={() => navigate("/")}
                className="px-4 py-2 border border-cyan-400/40 rounded hover:bg-cyan-500/10 transition"
              >
                acessar_dashboard
              </button>
            </motion.div>
          )}

          {!secretUnlocked && (
            <div className="mt-6 text-center">
              <button
                onClick={() => navigate("/")}
                className="px-6 py-2 border border-green-500/40 rounded-lg hover:bg-green-500/10 transition"
              >
                retornar_ao_dashboard.exe
              </button>
            </div>
          )}
        </div>
      </div>

      <style>
        {`
          .glitch {
            position: relative;
          }

          .glitch::before,
          .glitch::after {
            content: attr(data-text);
            position: absolute;
            left: 0;
            width: 100%;
            overflow: hidden;
          }

          .glitch::before {
            animation: glitchTop 1s infinite linear alternate-reverse;
            color: #00ffff;
            z-index: -1;
          }

          .glitch::after {
            animation: glitchBottom 1s infinite linear alternate-reverse;
            color: #ff00ff;
            z-index: -2;
          }

          @keyframes glitchTop {
            0% { clip-path: inset(0 0 80% 0); transform: translate(-2px, -2px); }
            50% { clip-path: inset(0 0 40% 0); transform: translate(2px, 2px); }
            100% { clip-path: inset(0 0 60% 0); transform: translate(-1px, 1px); }
          }

          @keyframes glitchBottom {
            0% { clip-path: inset(60% 0 0 0); transform: translate(2px, 2px); }
            50% { clip-path: inset(40% 0 0 0); transform: translate(-2px, -2px); }
            100% { clip-path: inset(70% 0 0 0); transform: translate(1px, -1px); }
          }

          @keyframes scan {
            0% { transform: translateY(0); }
            100% { transform: translateY(100vh); }
          }

          .animate-scan {
            animation: scan 4s linear infinite;
          }
        `}
      </style>
    </div>
  );
};

export default NotFound;

// toast-context.tsx
import * as React from "react";
import { v4 as uuid } from "uuid";

export type ToastData = {
  id: string;
  title?: string;
  description?: string;
  action?: React.ReactNode;
  duration?: number; // duração em ms
};

type ToastContextType = {
  toasts: ToastData[];
  addToast: (toast: Omit<ToastData, "id">) => void;
  removeToast: (id: string) => void;
};

const ToastContext = React.createContext<ToastContextType | undefined>(undefined);

export const ToastProviderGlobal: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = React.useState<ToastData[]>([]);

  const addToast = React.useCallback((toast: Omit<ToastData, "id">) => {
    const id = uuid();
    setToasts((prev) => [...prev, { id, ...toast }]);
    // Remove automaticamente após duration (default 5000ms)
    setTimeout(() => removeToast(id), toast.duration ?? 5000);
  }, []);

  const removeToast = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = React.useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within ToastProviderGlobal");
  return context;
};

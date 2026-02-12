import * as React from "react";
import type { ToastActionElement, ToastProps as BaseToastProps } from "@/components/ui/toast";
import { v4 as uuid } from "uuid";

const TOAST_LIMIT = 3; // limite de toasts simultâneos
const TOAST_REMOVE_DELAY = 5000; // ms (5 segundos por padrão)

// =========================
// Tipos
// =========================
export type ToasterToast = BaseToastProps & {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: ToastActionElement;
  open?: boolean;
};

type Action =
  | { type: "ADD"; toast: ToasterToast }
  | { type: "UPDATE"; toast: Partial<ToasterToast> & { id: string } }
  | { type: "DISMISS"; id: string }
  | { type: "REMOVE"; id: string };

interface State {
  toasts: ToasterToast[];
}

// =========================
// Reducer
// =========================
function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "ADD":
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      };
    case "UPDATE":
      return {
        ...state,
        toasts: state.toasts.map(t =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        ),
      };
    case "DISMISS":
      return {
        ...state,
        toasts: state.toasts.map(t =>
          t.id === action.id ? { ...t, open: false } : t
        ),
      };
    case "REMOVE":
      return {
        ...state,
        toasts: state.toasts.filter(t => t.id !== action.id),
      };
  }
}

// =========================
// Context
// =========================
const ToastContext = React.createContext<{
  state: State;
  addToast: (toast: Omit<ToasterToast, "id" | "open">) => ToasterToastController;
  dismiss: (id: string) => void;
} | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = React.useReducer(reducer, { toasts: [] });

  // =========================
  // Adicionar toast
  // =========================
  const addToast = React.useCallback(
    (toast: Omit<ToasterToast, "id" | "open">) => {
      const id = uuid();
      const toastObj: ToasterToast = { ...toast, id, open: true };
      dispatch({ type: "ADD", toast: toastObj });

      // Remove automático após delay
      const timeout = setTimeout(() => {
        dispatch({ type: "REMOVE", id });
      }, TOAST_REMOVE_DELAY);

      const dismiss = () => {
        clearTimeout(timeout);
        dispatch({ type: "DISMISS", id });
        setTimeout(() => dispatch({ type: "REMOVE", id }), 300); // animação de saída
      };

      const update = (props: Partial<ToasterToast>) =>
        dispatch({ type: "UPDATE", toast: { ...props, id } });

      return { id, dismiss, update };
    },
    []
  );

  const dismiss = React.useCallback((id: string) => dispatch({ type: "DISMISS", id }), []);

  return (
    <ToastContext.Provider value={{ state, addToast, dismiss }}>
      {children}
    </ToastContext.Provider>
  );
}

// =========================
// Hook
// =========================
export function useToast() {
  const ctx = React.useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

// =========================
// Controlador retornado ao criar toast
// =========================
export type ToasterToastController = {
  id: string;
  dismiss: () => void;
  update: (props: Partial<ToasterToast>) => void;
};

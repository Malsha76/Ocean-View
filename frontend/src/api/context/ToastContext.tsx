import React, { createContext, useContext, useMemo, useState } from 'react';

export type ToastType = 'success' | 'error';

type Toast = {
  id: number;
  type: ToastType;
  message: string;
};

type ToastContextType = {
  toasts: Toast[];
  showToast: (type: ToastType, message: string) => void;
  removeToast: (id: number) => void;
};

const ToastContext = createContext<ToastContextType | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  function removeToast(id: number) {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }

  function showToast(type: ToastType, message: string) {
    const id = Date.now() + Math.floor(Math.random() * 1000);
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => removeToast(id), 3500);
  }

  const value = useMemo(() => ({ toasts, showToast, removeToast }), [toasts]);

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>;
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context;
}

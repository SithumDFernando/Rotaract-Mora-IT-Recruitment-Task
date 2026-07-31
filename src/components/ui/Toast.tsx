'use client';

import * as React from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  toast: (message: string, type?: ToastType) => void;
}

const ToastContext = React.createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<Toast[]>([]);

  const toast = React.useCallback((message: string, type: ToastType = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 w-full max-w-sm px-4 sm:px-0">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={cn(
              'flex items-center justify-between p-4 rounded-lg shadow-lg border text-sm font-medium animate-in slide-in-from-bottom-5 fade-in duration-300',
              t.type === 'success' && 'bg-green-50 border-green-200 text-green-900 dark:bg-green-900/40 dark:border-green-800 dark:text-green-100',
              t.type === 'error' && 'bg-red-50 border-red-200 text-red-900 dark:bg-red-900/40 dark:border-red-800 dark:text-red-100',
              t.type === 'info' && 'bg-white border-slate-200 text-slate-900 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100'
            )}
          >
            <div className="flex items-center gap-3">
              {t.type === 'success' && <CheckCircle className="h-5 w-5 text-green-500" />}
              {t.type === 'error' && <AlertCircle className="h-5 w-5 text-red-500" />}
              {t.type === 'info' && <Info className="h-5 w-5 text-blue-500" />}
              <p>{t.message}</p>
            </div>
            <button
              onClick={() => removeToast(t.id)}
              className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

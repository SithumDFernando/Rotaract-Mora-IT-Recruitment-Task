'use client';

import * as React from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './Button';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export function Modal({ isOpen, onClose, title, description, children, footer }: ModalProps) {
  // Close on Escape key
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Dialog */}
      <div 
        className="relative z-50 w-full max-w-lg rounded-xl bg-white p-6 shadow-xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 fade-in duration-200 mx-4"
        role="dialog"
        aria-modal="true"
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-slate-100 dark:focus:ring-slate-800"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>

        <div className="flex flex-col space-y-1.5 text-center sm:text-left mb-4">
          <h2 className="text-lg font-semibold leading-none tracking-tight">
            {title}
          </h2>
          {description && (
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {description}
            </p>
          )}
        </div>

        <div className="py-4">
          {children}
        </div>

        {footer && (
          <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 mt-2">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

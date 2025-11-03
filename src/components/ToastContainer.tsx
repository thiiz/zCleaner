import React, { createContext, useContext, useState, useCallback } from 'react';
import { Toast, ToastProps } from './Toast';
import { AnimatePresence } from 'framer-motion';

/**
 * Toast Item Interface
 */
interface ToastItem extends Omit<ToastProps, 'visible' | 'onDismiss'> {
  id: string;
}

/**
 * Toast Context Interface
 */
interface ToastContextValue {
  /** Show a toast notification */
  showToast: (toast: Omit<ToastItem, 'id'>) => string;
  /** Show a success toast */
  success: (message: string, title?: string) => string;
  /** Show an error toast */
  error: (message: string, title?: string) => string;
  /** Show a warning toast */
  warning: (message: string, title?: string) => string;
  /** Show an info toast */
  info: (message: string, title?: string) => string;
  /** Dismiss a specific toast */
  dismissToast: (id: string) => void;
  /** Dismiss all toasts */
  dismissAll: () => void;
}

/**
 * Toast Context
 */
const ToastContext = createContext<ToastContextValue | undefined>(undefined);

/**
 * ToastProvider Props
 */
export interface ToastProviderProps {
  children: React.ReactNode;
  /** Maximum number of toasts to show at once */
  maxToasts?: number;
  /** Default toast duration in milliseconds */
  defaultDuration?: number;
  /** Toast position */
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
}

/**
 * Position styles mapping
 */
const positionStyles: Record<string, string> = {
  'top-right': 'top-4 right-4',
  'top-left': 'top-4 left-4',
  'bottom-right': 'bottom-4 right-4',
  'bottom-left': 'bottom-4 left-4',
  'top-center': 'top-4 left-1/2 -translate-x-1/2',
  'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2',
};

/**
 * ToastProvider Component
 * 
 * Provides toast notification functionality to the application.
 * 
 * @example
 * ```tsx
 * <ToastProvider maxToasts={3} position="top-right">
 *   <App />
 * </ToastProvider>
 * ```
 */
export const ToastProvider: React.FC<ToastProviderProps> = ({
  children,
  maxToasts = 5,
  defaultDuration = 5000,
  position = 'top-right',
}) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const showToast = useCallback((toast: Omit<ToastItem, 'id'>): string => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    const newToast: ToastItem = {
      ...toast,
      id,
      duration: toast.duration ?? defaultDuration,
    };

    setToasts((prev) => {
      const updated = [...prev, newToast];
      // Keep only the most recent toasts up to maxToasts
      return updated.slice(-maxToasts);
    });

    return id;
  }, [defaultDuration, maxToasts]);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const dismissAll = useCallback(() => {
    setToasts([]);
  }, []);

  const success = useCallback((message: string, title?: string): string => {
    return showToast({ type: 'success', message, title });
  }, [showToast]);

  const error = useCallback((message: string, title?: string): string => {
    return showToast({ type: 'error', message, title });
  }, [showToast]);

  const warning = useCallback((message: string, title?: string): string => {
    return showToast({ type: 'warning', message, title });
  }, [showToast]);

  const info = useCallback((message: string, title?: string): string => {
    return showToast({ type: 'info', message, title });
  }, [showToast]);

  const value: ToastContextValue = {
    showToast,
    success,
    error,
    warning,
    info,
    dismissToast,
    dismissAll,
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      
      {/* Toast Container */}
      <div
        className={`fixed ${positionStyles[position]} z-[var(--z-tooltip)] flex flex-col gap-3 pointer-events-none`}
        aria-live="polite"
        aria-atomic="true"
      >
        <AnimatePresence mode="popLayout">
          {toasts.map((toast) => (
            <div key={toast.id} className="pointer-events-auto">
              <Toast
                {...toast}
                visible={true}
                onDismiss={() => dismissToast(toast.id)}
              />
            </div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

/**
 * useToast Hook
 * 
 * Hook to access toast notification functionality.
 * 
 * @example
 * ```tsx
 * const toast = useToast();
 * 
 * // Show different types of toasts
 * toast.success('Operation completed successfully');
 * toast.error('Something went wrong');
 * toast.warning('Please review your input');
 * toast.info('New update available');
 * 
 * // Custom toast
 * toast.showToast({
 *   type: 'error',
 *   title: 'Error',
 *   message: 'Failed to save',
 *   duration: 3000,
 * });
 * ```
 */
export const useToast = (): ToastContextValue => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export default ToastProvider;

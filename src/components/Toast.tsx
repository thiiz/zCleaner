import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';
import { AlertCircle, CheckCircle, AlertTriangle, Info, X } from 'lucide-react';
import { useReducedMotion } from '@/hooks/useReducedMotion';

/**
 * Toast Type
 */
export type ToastType = 'success' | 'error' | 'warning' | 'info';

/**
 * Toast Props Interface
 */
export interface ToastProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  /** Toast type determines icon and color scheme */
  type?: ToastType;
  /** Toast title */
  title?: string;
  /** Toast message */
  message: string;
  /** Additional CSS classes */
  className?: string;
  /** Auto-dismiss duration in milliseconds (0 to disable) */
  duration?: number;
  /** Callback when toast is dismissed */
  onDismiss?: () => void;
  /** Show close button */
  showClose?: boolean;
  /** Visible state (controlled) */
  visible?: boolean;
}

/**
 * Toast icon mapping
 */
const toastIcons: Record<ToastType, React.ReactNode> = {
  success: <CheckCircle className="h-5 w-5" />,
  error: <AlertCircle className="h-5 w-5" />,
  warning: <AlertTriangle className="h-5 w-5" />,
  info: <Info className="h-5 w-5" />,
};

/**
 * Toast color mapping
 */
const toastColors: Record<ToastType, { border: string; icon: string; bg: string }> = {
  success: {
    border: 'border-[var(--color-success)]',
    icon: 'text-[var(--color-success)]',
    bg: 'bg-[var(--color-success)]/10',
  },
  error: {
    border: 'border-[var(--color-error)]',
    icon: 'text-[var(--color-error)]',
    bg: 'bg-[var(--color-error)]/10',
  },
  warning: {
    border: 'border-[var(--color-warning)]',
    icon: 'text-[var(--color-warning)]',
    bg: 'bg-[var(--color-warning)]/10',
  },
  info: {
    border: 'border-[var(--color-info)]',
    icon: 'text-[var(--color-info)]',
    bg: 'bg-[var(--color-info)]/10',
  },
};

/**
 * Toast Component
 * 
 * A notification component that slides in from the right and auto-dismisses.
 * 
 * Features:
 * - Slide-in animation from the right
 * - Auto-dismiss after configurable duration (default 5s)
 * - Multiple types: success, error, warning, info
 * - Close button
 * - Progress bar showing remaining time
 * - Design token integration
 * - Respects prefers-reduced-motion
 * 
 * @example
 * ```tsx
 * <Toast
 *   type="error"
 *   title="Operation Failed"
 *   message="Unable to complete the operation"
 *   onDismiss={() => console.log('dismissed')}
 * />
 * ```
 */
export const Toast: React.FC<ToastProps> = ({
  type = 'info',
  title,
  message,
  className,
  duration = 5000,
  onDismiss,
  showClose = true,
  visible = true,
  ...motionProps
}) => {
  const shouldReduceMotion = useReducedMotion();
  const [isVisible, setIsVisible] = useState(visible);
  const [progress, setProgress] = useState(100);

  const colors = toastColors[type];
  const icon = toastIcons[type];

  // Auto-dismiss timer
  useEffect(() => {
    if (!visible || duration === 0) return;

    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
      setProgress(remaining);

      if (remaining === 0) {
        clearInterval(interval);
        handleDismiss();
      }
    }, 16); // ~60fps

    return () => clearInterval(interval);
  }, [visible, duration]);

  // Sync with controlled visible prop
  useEffect(() => {
    setIsVisible(visible);
  }, [visible]);

  const handleDismiss = () => {
    setIsVisible(false);
    setTimeout(() => {
      onDismiss?.();
    }, shouldReduceMotion ? 0 : 200);
  };

  // Slide-in animation from the right
  const slideVariants = {
    initial: {
      x: shouldReduceMotion ? 0 : 400,
      opacity: shouldReduceMotion ? 1 : 0,
    },
    animate: {
      x: 0,
      opacity: 1,
      transition: {
        duration: shouldReduceMotion ? 0 : 0.3,
        ease: [0.4, 0, 0.2, 1] as const,
      },
    },
    exit: {
      x: shouldReduceMotion ? 0 : 400,
      opacity: 0,
      transition: {
        duration: shouldReduceMotion ? 0 : 0.2,
        ease: [0.4, 0, 1, 1] as const,
      },
    },
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          variants={slideVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className={cn(
            'relative flex flex-col',
            'w-full max-w-sm',
            'rounded-lg overflow-hidden',
            'bg-[var(--color-bg-tertiary)]',
            'border-l-4',
            colors.border,
            'border-t border-r border-b border-[var(--color-border-default)]',
            'shadow-lg',
            className
          )}
          role="alert"
          aria-live="assertive"
          {...motionProps}
        >
          {/* Content */}
          <div className="flex items-start gap-3 p-4">
            {/* Icon */}
            <div className={cn('flex-shrink-0', colors.icon)}>
              {icon}
            </div>

            {/* Text content */}
            <div className="flex-1 min-w-0">
              {title && (
                <h4 className="font-semibold text-[var(--color-text-primary)] text-[var(--font-size-sm)]">
                  {title}
                </h4>
              )}
              <p className={cn(
                'text-[var(--color-text-secondary)] text-[var(--font-size-sm)]',
                title && 'mt-1'
              )}>
                {message}
              </p>
            </div>

            {/* Close button */}
            {showClose && (
              <button
                onClick={handleDismiss}
                className={cn(
                  'flex-shrink-0 p-1 rounded',
                  'text-[var(--color-text-tertiary)]',
                  'hover:text-[var(--color-text-primary)]',
                  'hover:bg-[var(--color-bg-elevated)]',
                  'transition-colors duration-[var(--transition-fast)]',
                  'focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-primary)]'
                )}
                aria-label="Close notification"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Progress bar */}
          {duration > 0 && (
            <div className="h-1 bg-[var(--color-bg-elevated)]">
              <motion.div
                className={cn('h-full', colors.bg)}
                initial={{ width: '100%' }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.016, ease: 'linear' }}
              />
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Toast;

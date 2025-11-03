import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { AnimatedButton } from './AnimatedButton';

/**
 * ErrorState Props Interface
 */
export interface ErrorStateProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  /** Error title */
  title?: string;
  /** Error message */
  message: string;
  /** Additional CSS classes */
  className?: string;
  /** Retry callback function */
  onRetry?: () => void;
  /** Retry button text */
  retryText?: string;
  /** Show shake animation (for validation errors) */
  shake?: boolean;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Show error icon */
  showIcon?: boolean;
}

/**
 * ErrorState Component
 * 
 * A component for displaying error states with optional retry functionality.
 * 
 * Features:
 * - Shake animation for validation errors (translateX -4px → 4px → 0, 400ms)
 * - Retry button with hover animation
 * - Multiple size variants
 * - Error icon with pulse animation
 * - Design token integration
 * - Respects prefers-reduced-motion
 * 
 * @example
 * ```tsx
 * <ErrorState
 *   title="Operation Failed"
 *   message="Unable to complete the operation"
 *   onRetry={handleRetry}
 *   shake
 * />
 * ```
 */
export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Error',
  message,
  className,
  onRetry,
  retryText = 'Try Again',
  shake = false,
  size = 'md',
  showIcon = true,
  ...motionProps
}) => {
  const shouldReduceMotion = useReducedMotion();

  // Shake animation for validation errors
  const shakeVariants = {
    initial: { x: 0 },
    shake: shake && !shouldReduceMotion ? {
      x: [-4, 4, -4, 4, -2, 2, 0],
      transition: {
        duration: 0.4,
        ease: 'easeInOut' as const,
      },
    } : {},
  };

  // Icon pulse animation
  const iconPulseVariants = {
    animate: !shouldReduceMotion ? {
      scale: [1, 1.1, 1],
      opacity: [1, 0.8, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut' as const,
      },
    } : {},
  };

  // Size-based styles
  const sizeStyles = {
    sm: {
      container: 'p-3 gap-2',
      icon: 'h-4 w-4',
      title: 'text-[var(--font-size-sm)]',
      message: 'text-[var(--font-size-xs)]',
    },
    md: {
      container: 'p-4 gap-3',
      icon: 'h-5 w-5',
      title: 'text-[var(--font-size-base)]',
      message: 'text-[var(--font-size-sm)]',
    },
    lg: {
      container: 'p-6 gap-4',
      icon: 'h-6 w-6',
      title: 'text-[var(--font-size-lg)]',
      message: 'text-[var(--font-size-base)]',
    },
  };

  const styles = sizeStyles[size];

  return (
    <motion.div
      variants={shakeVariants}
      initial="initial"
      animate={shake ? 'shake' : 'initial'}
      role="alert"
      aria-live="assertive"
      className={cn(
        'flex flex-col',
        'rounded-lg',
        'bg-[var(--color-bg-tertiary)]',
        'border-l-4 border-[var(--color-error)]',
        'border-t border-r border-b border-[var(--color-border-default)]',
        shake && 'will-change-transform',
        styles.container,
        className
      )}
      {...motionProps}
    >
      {/* Header with icon and title */}
      <div className="flex items-start gap-3">
        {showIcon && (
          <motion.div
            variants={iconPulseVariants}
            animate="animate"
            className="flex-shrink-0 will-change-transform-opacity"
            aria-hidden="true"
          >
            <AlertCircle className={cn(styles.icon, 'text-[var(--color-error)]')} />
          </motion.div>
        )}
        
        <div className="flex-1 min-w-0">
          <h3 className={cn(
            'font-semibold text-[var(--color-text-primary)]',
            styles.title
          )}>
            {title}
          </h3>
          
          <p className={cn(
            'mt-1 text-[var(--color-text-secondary)]',
            styles.message
          )}>
            {message}
          </p>
        </div>
      </div>

      {/* Retry button */}
      {onRetry && (
        <div className="flex justify-end mt-2">
          <AnimatedButton
            variant="outline"
            size={size === 'lg' ? 'md' : 'sm'}
            onClick={onRetry}
            icon={<RefreshCw className="h-4 w-4" aria-hidden="true" />}
            className="border-[var(--color-error)] text-[var(--color-error)] hover:bg-[var(--color-error)]/10"
            aria-label={`${retryText} - Retry the failed operation`}
          >
            {retryText}
          </AnimatedButton>
        </div>
      )}
    </motion.div>
  );
};

export default ErrorState;

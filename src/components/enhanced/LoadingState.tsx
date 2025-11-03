import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import { useReducedMotion } from '@/hooks/useReducedMotion';

/**
 * LoadingState Variants using class-variance-authority
 * Defines visual styles for different loading types and sizes
 */
const loadingStateVariants = cva(
  // Base styles
  [
    'inline-flex flex-col items-center justify-center gap-3',
  ],
  {
    variants: {
      type: {
        spinner: 'gap-3',
        skeleton: 'w-full',
        progress: 'w-full gap-2',
      },
      size: {
        sm: 'text-[var(--font-size-xs)]',
        md: 'text-[var(--font-size-sm)]',
        lg: 'text-[var(--font-size-base)]',
      },
    },
    defaultVariants: {
      type: 'spinner',
      size: 'md',
    },
  }
);

/**
 * LoadingState Props Interface
 */
export interface LoadingStateProps
  extends Omit<HTMLMotionProps<'div'>, 'children'>,
  VariantProps<typeof loadingStateVariants> {
  /** Additional CSS classes */
  className?: string;
  /** Optional message to display below the loading indicator */
  message?: string;
  /** Progress value (0-100) for progress type */
  progress?: number;
}

/**
 * Spinner animation variants
 * Continuous rotation animation (respects reduced motion)
 */
const getSpinnerVariants = (shouldReduceMotion: boolean) => ({
  animate: {
    rotate: shouldReduceMotion ? 0 : 360,
    transition: {
      duration: shouldReduceMotion ? 0 : 1,
      repeat: shouldReduceMotion ? 0 : Infinity,
      ease: 'linear' as const,
    },
  },
});

/**
 * Skeleton pulse animation variants (respects reduced motion)
 */
const getSkeletonVariants = (shouldReduceMotion: boolean) => ({
  animate: {
    opacity: shouldReduceMotion ? 0.7 : [0.5, 1, 0.5],
    transition: {
      duration: shouldReduceMotion ? 0 : 1.5,
      repeat: shouldReduceMotion ? 0 : Infinity,
      ease: 'easeInOut' as const,
    },
  },
});

/**
 * Progress bar fill animation variants (respects reduced motion)
 */
const getProgressFillVariants = (shouldReduceMotion: boolean) => ({
  initial: {
    width: '0%',
  },
  animate: (progress: number) => ({
    width: `${progress}%`,
    transition: {
      duration: shouldReduceMotion ? 0 : 0.3,
      ease: [0.4, 0, 0.2, 1] as const,
    },
  }),
});

/**
 * Message fade-in animation (respects reduced motion)
 */
const getMessageVariants = (shouldReduceMotion: boolean) => ({
  initial: {
    opacity: shouldReduceMotion ? 1 : 0,
    y: shouldReduceMotion ? 0 : 4,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: shouldReduceMotion ? 0 : 0.2,
      ease: [0.4, 0, 0.2, 1] as const,
    },
  },
});

/**
 * LoadingState Component
 * 
 * A unified loading state component with multiple variants for different use cases.
 * 
 * Features:
 * - Spinner variant: Animated rotating spinner
 * - Skeleton variant: Pulse animation for content placeholders
 * - Progress variant: Progress bar with percentage
 * - Three sizes: sm, md, lg
 * - Optional message display
 * - Design token integration
 * - Smooth animations using Framer Motion
 * - Respects prefers-reduced-motion
 * 
 * @example
 * ```tsx
 * // Spinner loading
 * <LoadingState type="spinner" size="md" message="Loading data..." />
 * 
 * // Skeleton loading
 * <LoadingState type="skeleton" size="lg" />
 * 
 * // Progress loading
 * <LoadingState type="progress" progress={65} message="Processing files..." />
 * ```
 */
export const LoadingState: React.FC<LoadingStateProps> = ({
  className,
  type = 'spinner',
  size = 'md',
  message,
  progress = 0,
  ...motionProps
}) => {
  const shouldReduceMotion = useReducedMotion();
  // Size mappings for spinner icon
  const spinnerSizes = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
  };

  // Size mappings for skeleton height
  const skeletonSizes = {
    sm: 'h-16',
    md: 'h-24',
    lg: 'h-32',
  };

  // Size mappings for progress bar height
  const progressSizes = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
  };

  /**
   * Render Spinner Variant
   */
  const renderSpinner = () => (
    <>
      <div
        className="inline-flex text-[var(--color-text-secondary)]"
        aria-label={message || "Loading"}
        role="status"
      >
        <Loader2 className={cn(spinnerSizes[size || 'md'], 'animate-spin')} aria-hidden="true" />
      </div>
      {message && (
        <motion.p
          variants={getMessageVariants(shouldReduceMotion)}
          initial="initial"
          animate="animate"
          className="text-[var(--color-text-secondary)] text-center"
          aria-live="polite"
        >
          {message}
        </motion.p>
      )}
    </>
  );

  /**
   * Render Skeleton Variant
   */
  const renderSkeleton = () => (
    <>
      <motion.div
        variants={getSkeletonVariants(shouldReduceMotion)}
        animate="animate"
        className={cn(
          'w-full rounded-lg bg-[var(--color-bg-elevated)] will-change-opacity',
          skeletonSizes[size || 'md']
        )}
        aria-label={message || "Loading content"}
        role="status"
        aria-live="polite"
      />
      {message && (
        <motion.p
          variants={getMessageVariants(shouldReduceMotion)}
          initial="initial"
          animate="animate"
          className="text-center mt-2 will-change-opacity"
          style={{
            color: 'var(--color-text-secondary)',
            fontSize: 'var(--font-size-xs)'
          }}
          aria-live="polite"
        >
          {message}
        </motion.p>
      )}
    </>
  );

  /**
   * Render Progress Variant
   */
  const renderProgress = () => {
    // Clamp progress between 0 and 100
    const clampedProgress = Math.min(Math.max(progress, 0), 100);

    return (
      <>
        {/* Progress bar container */}
        <div className="w-full flex flex-col gap-2">
          <div
            className={cn(
              'w-full rounded-full bg-[var(--color-bg-elevated)] overflow-hidden',
              progressSizes[size || 'md']
            )}
            role="progressbar"
            aria-valuenow={clampedProgress}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={message || `Loading ${clampedProgress}%`}
          >
            {/* Progress bar fill */}
            <motion.div
              variants={getProgressFillVariants(shouldReduceMotion)}
              initial="initial"
              animate="animate"
              custom={clampedProgress}
              className={cn(
                'h-full bg-[var(--color-accent-primary)] rounded-full will-change-transform',
                progressSizes[size || 'md']
              )}
              aria-hidden="true"
            />
          </div>

          {/* Progress percentage */}
          <div className="flex items-center justify-between">
            <motion.span
              initial={{ opacity: shouldReduceMotion ? 1 : 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
              className="font-mono will-change-opacity"
              style={{
                color: 'var(--color-text-tertiary)',
                fontSize: 'var(--font-size-xs)'
              }}
              aria-live="polite"
            >
              {clampedProgress}%
            </motion.span>
            {message && (
              <motion.span
                variants={getMessageVariants(shouldReduceMotion)}
                initial="initial"
                animate="animate"
                className="will-change-opacity"
                style={{
                  color: 'var(--color-text-secondary)',
                  fontSize: 'var(--font-size-xs)'
                }}
                aria-live="polite"
              >
                {message}
              </motion.span>
            )}
          </div>
        </div>
      </>
    );
  };

  /**
   * Render appropriate variant based on type
   */
  const renderContent = () => {
    switch (type) {
      case 'spinner':
        return renderSpinner();
      case 'skeleton':
        return renderSkeleton();
      case 'progress':
        return renderProgress();
      default:
        return renderSpinner();
    }
  };

  return (
    <motion.div
      className={cn(
        loadingStateVariants({ type, size }),
        className
      )}
      {...motionProps}
    >
      {renderContent()}
    </motion.div>
  );
};

export default LoadingState;

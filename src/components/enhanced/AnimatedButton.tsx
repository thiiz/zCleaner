import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import { useReducedMotion } from '@/hooks/useReducedMotion';

/**
 * Button Variants using class-variance-authority
 * Defines visual styles for different button types and sizes
 */
const buttonVariants = cva(
  // Base styles
  [
    'inline-flex items-center justify-center gap-2',
    'rounded-lg font-medium',
    'transition-all duration-[var(--transition-fast)]',
    'will-change-transform-opacity',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring-color)] focus-visible:ring-offset-2',
    'disabled:opacity-[var(--opacity-disabled)] disabled:cursor-not-allowed disabled:pointer-events-none',
  ],
  {
    variants: {
      variant: {
        primary: [
          'bg-[var(--color-bg-elevated)]',
          '[color:var(--color-text-primary)]',
          'border border-[var(--color-border-default)]',
          'hover:bg-[var(--color-border-hover)] hover:border-[var(--color-border-hover)]',
          'active:bg-[var(--color-bg-secondary)]',
        ],
        secondary: [
          'bg-[var(--color-bg-elevated)]',
          '[color:var(--color-text-primary)]',
          'border border-[var(--color-border-default)]',
          'hover:bg-[var(--color-border-hover)] hover:border-[var(--color-border-hover)]',
          'active:bg-[var(--color-bg-secondary)]',
        ],
        outline: [
          'bg-transparent',
          '[color:var(--color-text-primary)]',
          'border border-[var(--color-border-default)]',
          'hover:bg-[var(--color-bg-elevated)] hover:border-[var(--color-border-hover)]',
          'active:bg-[var(--color-bg-secondary)]',
        ],
        ghost: [
          'bg-transparent',
          '[color:var(--color-text-primary)]',
          'hover:bg-[var(--color-bg-elevated)]',
          'active:bg-[var(--color-bg-secondary)]',
        ],
      },
      size: {
        sm: [
          'h-8 px-3 text-[var(--font-size-xs)]',
          'gap-1.5',
        ],
        md: [
          'h-10 px-6 text-[var(--font-size-sm)]',
          'gap-2',
        ],
        lg: [
          'h-12 px-8 text-[var(--font-size-base)]',
          'gap-2.5',
        ],
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

/**
 * AnimatedButton Props Interface
 */
export interface AnimatedButtonProps
  extends Omit<HTMLMotionProps<'button'>, 'children'>,
    VariantProps<typeof buttonVariants> {
  /** Button content */
  children: React.ReactNode;
  /** Additional CSS classes */
  className?: string;
  /** Loading state - shows spinner and disables button */
  loading?: boolean;
  /** Disabled state */
  disabled?: boolean;
  /** Icon to display before text */
  icon?: React.ReactNode;
  /** Button type */
  type?: 'button' | 'submit' | 'reset';
}

/**
 * Spinner animation variants for loading state
 * Duration is set to 0 when reduced motion is preferred
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
 * AnimatedButton Component
 * 
 * A modern button component with animations, multiple variants, and loading states.
 * 
 * Features:
 * - Multiple variants: primary, secondary, outline, ghost
 * - Three sizes: sm, md, lg
 * - Loading state with animated spinner
 * - Hover brightness increase animation
 * - Click scale animation (0.98)
 * - Icon support (left of text)
 * - Disabled state with reduced opacity
 * - Design token integration
 * - Accessibility support (focus indicators, ARIA)
 * - Respects prefers-reduced-motion
 * 
 * @example
 * ```tsx
 * <AnimatedButton variant="primary" size="md" onClick={handleClick}>
 *   Click me
 * </AnimatedButton>
 * 
 * <AnimatedButton variant="secondary" loading icon={<Save />}>
 *   Saving...
 * </AnimatedButton>
 * ```
 */
export const AnimatedButton = React.forwardRef<HTMLButtonElement, AnimatedButtonProps>(
  (
    {
      children,
      className,
      variant,
      size,
      loading = false,
      disabled = false,
      icon,
      type = 'button',
      onClick,
      ...motionProps
    },
    ref
  ) => {
    const shouldReduceMotion = useReducedMotion();

    // Button animation variants
    const buttonAnimationVariants = {
      initial: {
        scale: 1,
      },
      hover: !disabled && !loading ? {
        scale: shouldReduceMotion ? 1 : 1.01,
        transition: {
          duration: shouldReduceMotion ? 0 : 0.15,
          ease: [0.4, 0, 0.2, 1] as const,
        },
      } : {},
      tap: !disabled && !loading ? {
        scale: shouldReduceMotion ? 1 : 0.98,
        transition: {
          duration: shouldReduceMotion ? 0 : 0.1,
          ease: [0.4, 0, 0.2, 1] as const,
        },
      } : {},
    };

    const isDisabled = disabled || loading;

    return (
      <motion.button
        ref={ref}
        type={type}
        variants={buttonAnimationVariants}
        initial="initial"
        whileHover="hover"
        whileTap="tap"
        disabled={isDisabled}
        onClick={isDisabled ? undefined : onClick}
        className={cn(buttonVariants({ variant, size }), className)}
        aria-busy={loading}
        aria-disabled={isDisabled}
        {...motionProps}
      >
        {/* Loading spinner */}
        {loading && (
          <motion.div
            variants={getSpinnerVariants(shouldReduceMotion)}
            animate="animate"
            className="inline-flex"
            aria-label="Loading"
          >
            <Loader2 className="h-4 w-4" />
          </motion.div>
        )}
        
        {/* Icon (only shown when not loading) */}
        {!loading && icon && (
          <span className="inline-flex shrink-0">
            {icon}
          </span>
        )}
        
        {/* Button text */}
        <span className="inline-flex items-center">
          {children}
        </span>
      </motion.button>
    );
  }
);

AnimatedButton.displayName = 'AnimatedButton';

export default AnimatedButton;

import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useReducedMotion } from '@/hooks/useReducedMotion';

/**
 * InteractiveCard Props Interface
 * Enhanced card component with animations and interactive states
 */
export interface InteractiveCardProps extends Omit<HTMLMotionProps<'div'>, 'onClick'> {
  /** Card content */
  children: React.ReactNode;
  /** Additional CSS classes */
  className?: string;
  /** Click handler */
  onClick?: () => void;
  /** Disabled state */
  disabled?: boolean;
  /** Enable hover animations (default: true) */
  hoverable?: boolean;
}

/**
 * InteractiveCard Component
 * 
 * A modern card component with smooth animations and interactive states.
 * Features:
 * - Hover elevation animation (translateY -2px)
 * - Border color transitions
 * - Click/tap scale animation (0.98)
 * - Disabled state support
 * - Design token integration
 * - Respects prefers-reduced-motion
 * 
 * @example
 * ```tsx
 * <InteractiveCard onClick={() => console.log('clicked')}>
 *   <h3>Card Title</h3>
 *   <p>Card content</p>
 * </InteractiveCard>
 * ```
 */
export const InteractiveCard: React.FC<InteractiveCardProps> = ({
  children,
  className,
  onClick,
  disabled = false,
  hoverable = true,
  ...motionProps
}) => {
  const shouldReduceMotion = useReducedMotion();

  // Animation variants for hover and tap states
  const cardVariants = {
    initial: {
      y: 0,
      boxShadow: '0 0 0 0 rgba(0, 0, 0, 0)',
    },
    hover: hoverable && !disabled ? {
      y: shouldReduceMotion ? 0 : -2,
      boxShadow: shouldReduceMotion 
        ? '0 0 0 0 rgba(0, 0, 0, 0)' 
        : '0 10px 15px -3px rgba(0, 0, 0, 0.15)',
      transition: {
        duration: shouldReduceMotion ? 0 : 0.2,
        ease: [0.4, 0, 0.2, 1] as const, // ease-in-out
      },
    } : {},
    tap: !disabled ? {
      scale: shouldReduceMotion ? 1 : 0.98,
      transition: {
        duration: shouldReduceMotion ? 0 : 0.1,
        ease: [0.4, 0, 0.2, 1] as const,
      },
    } : {},
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="initial"
      whileHover="hover"
      whileTap="tap"
      onClick={disabled ? undefined : onClick}
      tabIndex={onClick && !disabled ? 0 : undefined}
      role={onClick ? 'button' : undefined}
      aria-disabled={disabled}
      onKeyDown={onClick && !disabled ? (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      } : undefined}
      className={cn(
        // Base styles with design tokens
        'rounded-lg p-6',
        'bg-[var(--color-bg-tertiary)]',
        'border border-[var(--color-border-default)]',
        'transition-colors duration-[var(--transition-base)]',
        
        // Performance optimization
        'will-change-transform-opacity',
        
        // Focus indicator (accessibility)
        onClick && !disabled && 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring-color)] focus-visible:ring-offset-2',
        
        // Interactive states
        !disabled && hoverable && [
          'hover:border-[var(--color-border-hover)]',
          onClick && 'cursor-pointer',
        ],
        
        // Disabled state
        disabled && [
          'opacity-[var(--opacity-disabled)]',
          'cursor-not-allowed',
          'pointer-events-none',
        ],
        
        // Custom classes
        className
      )}
      {...motionProps}
    >
      {children}
    </motion.div>
  );
};

export default InteractiveCard;

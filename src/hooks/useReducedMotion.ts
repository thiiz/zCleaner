import { useState, useEffect } from 'react';

/**
 * useReducedMotion Hook
 * 
 * Detects the user's motion preference from the system settings.
 * Returns true if the user prefers reduced motion (prefers-reduced-motion: reduce).
 * 
 * This hook respects accessibility preferences and should be used to disable
 * or reduce animations for users who have motion sensitivity.
 * 
 * @returns {boolean} True if user prefers reduced motion, false otherwise
 * 
 * @example
 * ```tsx
 * const shouldReduceMotion = useReducedMotion();
 * const transition = shouldReduceMotion ? { duration: 0 } : { duration: 0.3 };
 * ```
 */
export function useReducedMotion(): boolean {
  // Initialize with the current preference
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() => {
    // Check if window is available (SSR safety)
    if (typeof window === 'undefined') {
      return false;
    }
    
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    return mediaQuery.matches;
  });

  useEffect(() => {
    // Check if window is available (SSR safety)
    if (typeof window === 'undefined') {
      return;
    }

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    // Update state when preference changes
    const handleChange = (event: MediaQueryListEvent | MediaQueryList) => {
      setPrefersReducedMotion(event.matches);
    };

    // Set initial value
    handleChange(mediaQuery);

    // Listen for changes
    // Use addEventListener for modern browsers, addListener for older ones
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
    } else {
      // Fallback for older browsers
      mediaQuery.addListener(handleChange);
    }

    // Cleanup
    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleChange);
      } else {
        // Fallback for older browsers
        mediaQuery.removeListener(handleChange);
      }
    };
  }, []);

  return prefersReducedMotion;
}

export default useReducedMotion;

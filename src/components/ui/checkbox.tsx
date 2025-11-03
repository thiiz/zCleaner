import * as React from "react"
import { motion } from "framer-motion"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { useReducedMotion } from "@/hooks/useReducedMotion"

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  onCheckedChange?: (checked: boolean) => void
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, onCheckedChange, checked, ...props }, ref) => {
    const shouldReduceMotion = useReducedMotion();

    return (
      <label className="relative inline-flex items-center cursor-pointer group">
        <input
          type="checkbox"
          className="sr-only peer"
          ref={ref}
          checked={checked}
          onChange={(e) => onCheckedChange?.(e.target.checked)}
          aria-checked={checked}
          {...props}
        />
        <motion.div
          className={cn(
            "h-4 w-4 shrink-0 rounded border border-neutral-700 bg-[#0a0a0a] flex items-center justify-center will-change-transform",
            "peer-focus-visible:ring-2 peer-focus-visible:ring-[var(--focus-ring-color)] peer-focus-visible:ring-offset-2",
            "peer-checked:bg-neutral-200 peer-checked:border-neutral-200",
            "peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
            "transition-colors duration-150",
            className
          )}
          animate={checked ? {
            scale: shouldReduceMotion ? 1 : [1, 1.2, 1],
          } : {
            scale: 1
          }}
          transition={{
            duration: shouldReduceMotion ? 0 : 0.3,
            ease: [0.68, -0.55, 0.265, 1.55] // bounce easing
          }}
          aria-hidden="true"
        >
          <motion.div
            initial={false}
            animate={checked ? {
              scale: 1,
              opacity: 1,
            } : {
              scale: shouldReduceMotion ? 1 : 0.5,
              opacity: 0,
            }}
            transition={{
              duration: shouldReduceMotion ? 0 : 0.2,
              ease: "easeOut"
            }}
            className="will-change-transform-opacity"
          >
            <Check className="h-3 w-3 text-[#0a0a0a]" aria-hidden="true" />
          </motion.div>
        </motion.div>
      </label>
    )
  }
)
Checkbox.displayName = "Checkbox"

export { Checkbox }

import * as React from "react"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  onCheckedChange?: (checked: boolean) => void
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, onCheckedChange, checked, ...props }, ref) => {
    return (
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          className="sr-only peer"
          ref={ref}
          checked={checked}
          onChange={(e) => onCheckedChange?.(e.target.checked)}
          {...props}
        />
        <div
          className={cn(
            "h-4 w-4 shrink-0 rounded border border-neutral-700 bg-[#0a0a0a] flex items-center justify-center",
            "peer-focus-visible:ring-2 peer-focus-visible:ring-neutral-400 peer-focus-visible:ring-offset-2",
            "peer-checked:bg-neutral-200 peer-checked:border-neutral-200",
            "peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
            "transition-all duration-150",
            className
          )}
        >
          <Check className={cn(
            "h-3 w-3 text-[#0a0a0a] transition-opacity",
            checked ? "opacity-100" : "opacity-0"
          )} />
        </div>
      </label>
    )
  }
)
Checkbox.displayName = "Checkbox"

export { Checkbox }

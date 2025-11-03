import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TabButtonProps {
  icon: LucideIcon;
  label: string;
  active: boolean;
  onClick: () => void;
}

export default function TabButton({ icon: Icon, label, active, onClick }: TabButtonProps) {
  return (
    <button
      onClick={onClick}
      aria-label={`Navigate to ${label} tab`}
      aria-current={active ? 'page' : undefined}
      className={cn(
        "w-full flex items-center px-3 py-2.5 rounded-md relative",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring-color)] focus-visible:ring-offset-2",
        "transition-all active:scale-[0.98] will-change-transform",
        active
          ? "bg-[#1f1f1f] text-[#f5f5f5] border-l-[3px] border-l-[#f5f5f5] pl-[9px]"
          : "text-[#737373] hover:bg-[#1a1a1a] hover:text-[#a3a3a3] border-l-[3px] border-l-transparent pl-[9px]"
      )}
      style={{
        transitionDuration: '150ms',
        gap: '12px'
      }}
    >
      <Icon className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
      <span className="font-medium text-sm">{label}</span>
    </button>
  );
}

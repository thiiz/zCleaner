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
      className={cn(
        "w-full flex items-center gap-3 px-3 py-2.5 rounded-md transition-all duration-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-600",
        active
          ? "bg-neutral-200 text-neutral-900 active:scale-[0.98]"
          : "text-neutral-400 hover:bg-[#1a1a1a] hover:text-neutral-300 active:bg-[#141414] active:scale-[0.98]"
      )}
    >
      <Icon className="w-4 h-4 flex-shrink-0" />
      <span className="font-medium text-sm">{label}</span>
    </button>
  );
}

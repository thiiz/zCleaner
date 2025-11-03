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
        "w-full flex items-center gap-2 md:gap-3 px-3 md:px-4 py-2.5 md:py-3 rounded-sm transition-all duration-150",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900",
        active
          ? "bg-blue-600 text-white shadow-sm shadow-blue-500/50 active:bg-blue-700 active:scale-[0.98]"
          : "text-gray-300 hover:bg-gray-700/50 hover:text-white active:bg-gray-700 active:scale-[0.98]"
      )}
    >
      <Icon className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0" />
      <span className="font-medium text-sm md:text-base">{label}</span>
    </button>
  );
}

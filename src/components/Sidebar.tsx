import { Trash2, Gauge, Settings, Battery, Cpu } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import TabButton from './TabButton';

export type TabType = 'cleaning' | 'performance' | 'startup' | 'power' | 'system';

interface SidebarProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

interface Tab {
  id: TabType;
  label: string;
  icon: LucideIcon;
}

const tabs: Tab[] = [
  { id: 'cleaning', label: 'Limpeza', icon: Trash2 },
  { id: 'performance', label: 'Desempenho', icon: Gauge },
  { id: 'startup', label: 'Inicialização', icon: Settings },
  { id: 'power', label: 'Energia', icon: Battery },
  { id: 'system', label: 'Sistema', icon: Cpu }
];

export default function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  return (
    <aside 
      className="flex-shrink-0 border-r p-4 lg:p-5 bg-primary border-subtle transition-all duration-[var(--transition-base)]"
      role="navigation"
      aria-label="Main navigation"
      style={{
        width: 'var(--sidebar-width-sm)',
      }}
    >
      <style>{`
        @media (min-width: 1024px) {
          aside {
            width: var(--sidebar-width-md);
          }
        }
      `}</style>
      <nav className="space-y-1.5" role="tablist">
        {tabs.map(tab => (
          <TabButton
            key={tab.id}
            icon={tab.icon}
            label={tab.label}
            active={activeTab === tab.id}
            onClick={() => onTabChange(tab.id)}
          />
        ))}
      </nav>
    </aside>
  );
}

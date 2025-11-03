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
    <aside className="w-56 md:w-64 bg-[#0a0a0a] border-r border-[#1a1a1a] p-4 md:p-5 flex-shrink-0">
      <nav className="space-y-1.5">
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

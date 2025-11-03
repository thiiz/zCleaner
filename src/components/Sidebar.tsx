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
    <aside className="w-56 md:w-64 bg-gray-800/50 backdrop-blur-sm border-r border-gray-700/50 p-3 md:p-4 flex-shrink-0">
      <nav className="space-y-2">
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

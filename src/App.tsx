import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import TitleBar from './components/TitleBar';
import Header from './components/Header';
import Sidebar, { type TabType } from './components/Sidebar';
import CleaningTab from './tabs/CleaningTab';
import PerformanceTab from './tabs/PerformanceTab';
import StartupTab from './tabs/StartupTab';
import PowerTab from './tabs/PowerTab';
import SystemTab from './tabs/SystemTab';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('cleaning');

  return (
    <div className="min-h-screen min-w-[800px] bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <TitleBar />
      <Header />
      <div className="flex h-[calc(100vh-112px)] min-h-[520px]">
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
        <main className="flex-1 p-4 md:p-6 overflow-y-auto">
          <AnimatePresence mode="wait">
            {activeTab === 'cleaning' && <CleaningTab key="cleaning" />}
            {activeTab === 'performance' && <PerformanceTab key="performance" />}
            {activeTab === 'startup' && <StartupTab key="startup" />}
            {activeTab === 'power' && <PowerTab key="power" />}
            {activeTab === 'system' && <SystemTab key="system" />}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

export default App;

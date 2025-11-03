import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import TitleBar from './components/TitleBar';
import Header from './components/Header';
import Sidebar, { type TabType } from './components/Sidebar';
import PerformanceTab from './tabs/PerformanceTab';
import StartupTab from './tabs/StartupTab';
import PowerTab from './tabs/PowerTab';
import { ToastProvider } from './components/enhanced/ToastContainer';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('performance');

  return (
    <ToastProvider position="top-right" maxToasts={3}>
      <div className="min-h-screen min-w-[800px] bg-[#0a0a0a]">
        <TitleBar />
        <Header />
        <div className="flex h-[calc(100vh-112px)] min-h-[520px]">
          <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
          <main className="flex-1 overflow-y-auto bg-[#0f0f0f] transition-all duration-[var(--transition-base)]" style={{ padding: 'var(--padding-mobile)' }}>
            <style>{`
              @media (min-width: 1024px) {
                main {
                  padding: var(--padding-desktop);
                }
              }
            `}</style>
            <AnimatePresence mode="wait">
              {activeTab === 'performance' && <PerformanceTab key="performance" />}
              {activeTab === 'startup' && <StartupTab key="startup" />}
              {activeTab === 'power' && <PowerTab key="power" />}
            </AnimatePresence>
          </main>
        </div>
      </div>
    </ToastProvider>
  );
}

export default App;

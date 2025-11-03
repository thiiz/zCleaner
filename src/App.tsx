import TitleBar from './components/TitleBar';
import Header from './components/Header';
import PerformanceTab from './tabs/PerformanceTab';
import { ToastProvider } from './components/enhanced/ToastContainer';
import './App.css';

function App() {
  return (
    <ToastProvider position="top-right" maxToasts={3}>
      <div className="min-h-screen min-w-[800px] bg-[#0a0a0a]">
        <TitleBar />
        <Header />
        <main className="overflow-y-auto bg-[#0f0f0f] h-[calc(100vh-112px)] min-h-[520px]" style={{ padding: 'var(--padding-mobile)' }}>
          <style>{`
            @media (min-width: 1024px) {
              main {
                padding: var(--padding-desktop);
              }
            }
          `}</style>
          <PerformanceTab />
        </main>
      </div>
    </ToastProvider>
  );
}

export default App;

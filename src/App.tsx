import TitleBar from './components/TitleBar';
import Dashboard from './tabs/Dashboard';
import { ToastProvider } from './components/ToastContainer';
import './App.css';

function App() {
  return (
    <ToastProvider position="top-right" maxToasts={3}>
      <div className="min-h-screen min-w-[800px] bg-[#0a0a0a]">
        <TitleBar />
        <main className="overflow-y-auto bg-[#0f0f0f] h-[calc(100vh-32px)] min-h-[520px]" style={{ paddingLeft: 'var(--padding-mobile)', paddingRight: 'var(--padding-mobile)', paddingTop: 'var(--padding-mobile)' }}>
          <style>{`
            @media (min-width: 1024px) {
              main {
                padding-left: var(--padding-desktop);
                padding-right: var(--padding-desktop);
                padding-top: var(--padding-desktop);
              }
            }
          `}</style>
          <Dashboard />
        </main>
      </div>
    </ToastProvider>
  );
}

export default App;

import { Zap } from 'lucide-react';

export default function Header() {
  return (
    <header className="h-20 bg-[#0a0a0a] border-b border-[#1a1a1a] flex items-center px-6 md:px-8">
      <Zap className="w-5 h-5 md:w-6 md:h-6 text-neutral-400 transition-all duration-150" />
      <h1 className="text-lg md:text-xl font-medium text-neutral-200 ml-3 tracking-tight">Windows Booster</h1>
    </header>
  );
}

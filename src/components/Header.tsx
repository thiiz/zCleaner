import { Zap } from 'lucide-react';

export default function Header() {
  return (
    <header className="h-20 bg-gray-900/50 backdrop-blur-sm border-b border-gray-700/50 flex items-center px-4 md:px-6">
      <Zap className="w-6 h-6 md:w-8 md:h-8 text-blue-500 transition-all duration-150" />
      <h1 className="text-xl md:text-2xl font-semibold text-white ml-2 md:ml-3 transition-all duration-150">Windows Booster</h1>
    </header>
  );
}

import { getCurrentWindow } from '@tauri-apps/api/window';
import { Minus, Square, X } from 'lucide-react';

const TitleBar = () => {
  const appWindow = getCurrentWindow();

  const handleMinimize = () => {
    appWindow.minimize();
  };

  const handleMaximize = () => {
    appWindow.toggleMaximize();
  };

  const handleClose = () => {
    appWindow.close();
  };

  return (
    <div
      data-tauri-drag-region
      className="h-8 bg-[#0a0a0a] flex items-center justify-between px-3 select-none border-b border-[#1a1a1a]"
    >
      <div data-tauri-drag-region className="flex items-center gap-2 flex-1">
        <span className="text-xs text-neutral-500 font-medium tracking-wide">zcleaner</span>
      </div>

      <div className="flex items-center">
        <button
          onClick={handleMinimize}
          className="h-8 w-10 flex items-center justify-center hover:bg-[#1a1a1a] transition-colors duration-200"
          aria-label="Minimize"
        >
          <Minus className="w-4 h-4 text-neutral-500" />
        </button>
        <button
          onClick={handleMaximize}
          className="h-8 w-10 flex items-center justify-center hover:bg-[#1a1a1a] transition-colors duration-200"
          aria-label="Maximize"
        >
          <Square className="w-3.5 h-3.5 text-neutral-500" />
        </button>
        <button
          onClick={handleClose}
          className="h-8 w-10 flex items-center justify-center hover:bg-red-500/10 hover:text-red-500 transition-colors duration-200"
          aria-label="Close"
        >
          <X className="w-4 h-4 text-neutral-500" />
        </button>
      </div>
    </div>
  );
};

export default TitleBar;

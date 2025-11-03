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
      className="h-8 bg-gray-900/95 flex items-center justify-between px-2 select-none border-b border-gray-800"
    >
      <div data-tauri-drag-region className="flex items-center gap-2 flex-1">
        <span className="text-xs text-gray-400 font-medium">zcleaner</span>
      </div>

      <div className="flex items-center">
        <button
          onClick={handleMinimize}
          className="h-8 w-10 flex items-center justify-center hover:bg-gray-800 transition-colors"
          aria-label="Minimize"
        >
          <Minus className="w-4 h-4 text-gray-400" />
        </button>
        <button
          onClick={handleMaximize}
          className="h-8 w-10 flex items-center justify-center hover:bg-gray-800 transition-colors"
          aria-label="Maximize"
        >
          <Square className="w-3.5 h-3.5 text-gray-400" />
        </button>
        <button
          onClick={handleClose}
          className="h-8 w-10 flex items-center justify-center hover:bg-red-600 transition-colors"
          aria-label="Close"
        >
          <X className="w-4 h-4 text-gray-400" />
        </button>
      </div>
    </div>
  );
};

export default TitleBar;

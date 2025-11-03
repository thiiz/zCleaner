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
      className="h-8 flex items-center justify-between px-3 select-none border-b"
      style={{
        backgroundColor: 'var(--color-bg-primary)',
        borderColor: 'var(--color-border-subtle)',
      }}
    >
      <div data-tauri-drag-region className="flex items-center gap-2 flex-1">
        <span 
          className="text-xs font-medium tracking-wide"
          style={{ color: 'var(--color-text-tertiary)' }}
        >
          zcleaner
        </span>
      </div>

      <div className="flex items-center">
        <button
          onClick={handleMinimize}
          className="h-8 w-10 flex items-center justify-center transition-colors"
          style={{
            transitionDuration: 'var(--transition-base)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--color-bg-elevated)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
          aria-label="Minimize"
        >
          <Minus 
            className="w-4 h-4"
            style={{ color: 'var(--color-text-tertiary)' }}
          />
        </button>
        <button
          onClick={handleMaximize}
          className="h-8 w-10 flex items-center justify-center transition-colors"
          style={{
            transitionDuration: 'var(--transition-base)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--color-bg-elevated)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
          aria-label="Maximize"
        >
          <Square 
            className="w-3.5 h-3.5"
            style={{ color: 'var(--color-text-tertiary)' }}
          />
        </button>
        <button
          onClick={handleClose}
          className="h-8 w-10 flex items-center justify-center transition-colors group"
          style={{
            transitionDuration: 'var(--transition-base)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgb(239 68 68 / 0.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
          aria-label="Close"
        >
          <X 
            className="w-4 h-4 transition-colors group-hover:text-red-500"
            style={{ 
              color: 'var(--color-text-tertiary)',
              transitionDuration: 'var(--transition-base)',
            }}
          />
        </button>
      </div>
    </div>
  );
};

export default TitleBar;

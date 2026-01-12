'use client';
import Image from 'next/image';
import { Minus, Square, X } from 'lucide-react';

// This is a type declaration to inform TypeScript about the custom `electronAPI`
// that will be injected into the `window` object by your Electron preload script.
declare global {
  interface Window {
    electronAPI?: {
      minimize: () => void;
      maximize: () => void;
      close: () => void;
      getSystemInfo: () => Promise<any>;
    };
  }
}

export default function TitleBar() {
  const handleMinimize = () => window.electronAPI?.minimize();
  const handleMaximize = () => window.electronAPI?.maximize();
  const handleClose = () => window.electronAPI?.close();

  return (
    <div 
      className="flex h-10 items-center justify-between px-4 gradient-dark text-primary-foreground" 
      style={{ WebkitAppRegion: 'drag' } as React.CSSProperties}
    >
      <div className="flex items-center gap-2">
        <Image src="/logo.png" alt="ESYSTEMLK Logo" width={20} height={20} />
        <span className="text-sm font-bold text-gradient">E central system V 1.1</span>
      </div>

      <div className="flex items-center" style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}>
        <button
          onClick={handleMinimize}
          className="p-2 text-muted-foreground transition-colors hover:bg-white/10 rounded-md"
          aria-label="Minimize"
        >
          <Minus className="h-4 w-4" />
        </button>
        <button
          onClick={handleMaximize}
          className="p-2 text-muted-foreground transition-colors hover:bg-white/10 rounded-md"
          aria-label="Maximize"
        >
          <Square className="h-4 w-4" />
        </button>
        <button
          onClick={handleClose}
          className="p-2 text-muted-foreground transition-colors hover:bg-destructive/80 rounded-md"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

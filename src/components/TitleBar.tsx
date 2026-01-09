'use client';

// This is a type declaration to inform TypeScript about the custom `electronAPI`
// that will be injected into the `window` object by your Electron preload script.
declare global {
  interface Window {
    electronAPI?: {
      minimize: () => void;
      maximize: () => void;
      close: () => void;
    };
  }
}

export default function TitleBar() {
  return (
    <div className="flex h-8 items-center justify-between bg-slate-900 px-2.5 text-white" style={{ WebkitAppRegion: 'drag' } as React.CSSProperties}>
      <span className="text-sm font-semibold">ESystemLK</span>

      <div className="flex items-center" style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}>
        <button
          onClick={() => window.electronAPI?.minimize()}
          className="px-3 py-1 text-sm hover:bg-slate-700 rounded-sm"
          aria-label="Minimize"
        >
          —
        </button>
        <button
          onClick={() => window.electronAPI?.maximize()}
          className="px-3 py-1 text-sm hover:bg-slate-700 rounded-sm"
          aria-label="Maximize"
        >
          ▢
        </button>
        <button
          onClick={() => window.electronAPI?.close()}
          className="px-3 py-1 text-sm hover:bg-destructive rounded-sm"
          aria-label="Close"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

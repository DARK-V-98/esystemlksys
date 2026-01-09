import { WifiOff, Cpu } from "lucide-react";

export default function OfflinePage() {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden bg-black text-white">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `radial-gradient(circle at center, hsl(0 100% 50% / 0.15) 0%, transparent 50%),
                              linear-gradient(hsl(0 100% 50% / 0.2) 1px, transparent 1px),
                              linear-gradient(90deg, hsl(0 100% 50% / 0.2) 1px, transparent 1px)`,
            backgroundSize: '50px 50px, 50px 50px, 50px 50px',
          }}
        />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-destructive/10 blur-[150px]" />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center p-8 animate-fade-in">
        <div className="relative">
          <WifiOff className="h-24 w-24 text-destructive animate-pulse" style={{ animationDuration: '1.5s' }} />
          <div className="absolute inset-0 rounded-full border-2 border-destructive/50 animate-ping" />
        </div>

        <h1 className="mt-12 text-5xl font-black text-white">
          Connection Lost
        </h1>
        <p className="mt-4 max-w-md text-lg text-white/70">
          Your device is currently offline. Please check your network connection and try again. Some features may be unavailable.
        </p>
        
        <div className="mt-12 flex items-center justify-center gap-4 rounded-xl border border-white/20 bg-white/5 p-4 backdrop-blur-sm">
           <div className="flex h-12 w-12 items-center justify-center rounded-lg gradient-primary shadow-glow">
              <Cpu className="h-7 w-7 text-primary-foreground" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gradient">ESYSTEMLK</h2>
              <p className="text-sm text-muted-foreground">Offline Mode</p>
            </div>
        </div>
      </div>
    </div>
  );
}

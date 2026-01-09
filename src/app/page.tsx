'use client';
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Cpu, Zap, Shield, Wrench, Database, HardDrive, MemoryStick, CornerDownLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const loadingSteps = [
  "Initializing core modules...",
  "Establishing secure connection...",
  "Loading system utilities...",
  "Defragmenting memory nodes...",
  "Calibrating performance metrics...",
  "Finalizing interface...",
  "Ready for entry.",
];

export default function SplashScreen() {
  const [phase, setPhase] = useState(0);
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState(loadingSteps[0]);
  const [showEnterButton, setShowEnterButton] = useState(false);
  const router = useRouter();

  const handleNavigation = useCallback(() => {
    // Always navigate to auth page from splash as per requirement
    router.push("/auth");
  }, [router]);

  useEffect(() => {
    // Phase transitions for a 6-second animation
    const phases = [
      { delay: 200, next: 1 },   // Logo appears
      { delay: 1200, next: 2 },  // Text appears
      { delay: 2200, next: 3 },  // Loading bar and icons appear
    ];

    phases.forEach(({ delay, next }) => {
      setTimeout(() => setPhase(next), delay);
    });

    // Progress bar animation over ~4 seconds
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 1;
      });
    }, 35);

    // Update loading text
    let step = 0;
    const textInterval = setInterval(() => {
      step++;
      if (step < loadingSteps.length) {
        setLoadingText(loadingSteps[step]);
      } else {
        clearInterval(textInterval);
      }
    }, 600);

    // Show enter button after 6 seconds
    const enterTimeout = setTimeout(() => {
      setShowEnterButton(true);
    }, 6000);


    // Keyboard listener for Enter/Space
    const handleKeyDown = (event: KeyboardEvent) => {
      if (showEnterButton && (event.key === 'Enter' || event.key === ' ')) {
        handleNavigation();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearTimeout(enterTimeout);
      clearInterval(progressInterval);
      clearInterval(textInterval);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [router, handleNavigation, showEnterButton]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-black">
      {/* Animated Background */}
      <div className="absolute inset-0">
        {/* Grid pattern */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `radial-gradient(circle at center, hsl(348 100% 50% / 0.15) 0%, transparent 50%),
                              linear-gradient(hsl(348 100% 50% / 0.2) 1px, transparent 1px),
                              linear-gradient(90deg, hsl(348 100% 50% / 0.2) 1px, transparent 1px)`,
            backgroundSize: '50px 50px, 50px 50px, 50px 50px',
          }}
        />
        
        {/* Glowing orbs */}
        <div className="absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-primary/20 blur-[120px] animate-pulse" />
        <div className="absolute right-1/4 bottom-1/4 h-80 w-80 rounded-full bg-primary/15 blur-[100px] animate-pulse" style={{ animationDelay: '0.5s' }} />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-primary/5 blur-[150px]" />
        
        {/* Scanning lines */}
        <div className="absolute inset-0 overflow-hidden">
          <div 
            className="absolute h-full w-[1px] bg-gradient-to-b from-transparent via-primary to-transparent opacity-30"
            style={{
              animation: 'scanLineX 3s linear infinite',
              left: '20%',
            }}
          />
          <div 
            className="absolute h-[1px] w-full bg-gradient-to-r from-transparent via-primary to-transparent opacity-30"
            style={{
              animation: 'scanLineY 4s linear infinite',
              top: '40%',
            }}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className={`relative z-10 flex flex-col items-center transition-opacity duration-500 ${showEnterButton ? 'opacity-20 blur-md' : 'opacity-100'}`}>
        {/* Logo Container */}
        <div 
          className={`relative transition-all duration-1000 ${
            phase >= 1 ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
          }`}
        >
          {/* Outer ring */}
          <div className="absolute -inset-8 rounded-full border-2 border-primary/30 animate-spin" style={{ animationDuration: '8s' }} />
          <div className="absolute -inset-12 rounded-full border border-primary/20 animate-spin" style={{ animationDuration: '12s', animationDirection: 'reverse' }} />
          
          {/* Inner pulsing glow */}
          <div className="absolute -inset-4 rounded-3xl bg-primary/30 blur-2xl animate-pulse" />
          
          {/* Logo */}
          <div className="relative flex h-32 w-32 items-center justify-center rounded-3xl gradient-primary shadow-glow-intense">
            <Cpu className="h-16 w-16 text-white" />
            
            {/* Corner accents */}
            <div className="absolute -right-2 -top-2 h-4 w-4 rounded-full bg-primary shadow-glow animate-ping" />
            <div className="absolute -bottom-2 -left-2 h-3 w-3 rounded-full bg-primary shadow-glow animate-ping" style={{ animationDelay: '0.5s' }} />
          </div>
        </div>

        {/* Brand Text */}
        <div 
          className={`mt-12 text-center transition-all duration-1000 ${
            phase >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <h1 className="text-6xl font-black tracking-tight">
            <span className="text-white">E</span>
            <span className="text-primary neon-text">SYSTEM</span>
            <span className="text-white">LK</span>
          </h1>
          <p className="mt-3 text-xl font-medium text-white/60 tracking-widest uppercase">
            Multipurpose System
          </p>
        </div>

        {/* Feature Icons */}
        <div 
          className={`mt-10 flex items-center gap-6 transition-all duration-1000 ${
            phase >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
          style={{ transitionDelay: '300ms' }}
        >
          {[
            { icon: Wrench, label: "Tools" },
            { icon: HardDrive, label: "Storage" },
            { icon: MemoryStick, label: "Memory" },
            { icon: Zap, label: "Performance" },
            { icon: Shield, label: "Security" },
          ].map((item, index) => (
            <div 
              key={item.label}
              className="flex flex-col items-center gap-2"
              style={{ animation: `icon-fade-in 0.5s ease-out ${2.5 + index * 0.1}s forwards`, opacity: 0 }}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-primary/30 bg-primary/10">
                <item.icon className="h-6 w-6 text-primary" />
              </div>
            </div>
          ))}
        </div>

        {/* Loading Bar */}
        <div 
          className={`mt-12 w-96 transition-all duration-500 ${
            phase >= 3 ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-semibold text-white/50 uppercase tracking-wider tabular-nums transition-opacity duration-300">
              {loadingText}
            </p>
            <span className="text-xs font-bold text-primary tabular-nums">
              {progress}%
            </span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10 border border-white/20">
            <div 
              className="h-full rounded-full gradient-primary shadow-glow transition-all duration-100"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

       {/* Enter Button */}
        {showEnterButton && (
            <div className="absolute z-20 flex flex-col items-center animate-fade-in" style={{animationDuration: '1s'}}>
                <button
                    onClick={handleNavigation}
                    className="w-80 h-20 text-3xl font-black text-white rounded-2xl border-2 border-primary bg-primary/20 shadow-glow-intense animate-pulse-glow neon-border transition-all duration-300 hover:bg-primary/30 hover:shadow-red-500/80"
                >
                    Enter
                </button>
            </div>
        )}

      {/* Fade out overlay - Removed to keep splash visible */}
      

      {/* Custom styles */}
      <style jsx>{`
        @keyframes scanLineX {
          0% { transform: translateX(-100vw); }
          100% { transform: translateX(100vw); }
        }
        @keyframes scanLineY {
          0% { transform: translateY(-100vh); }
          100% { transform: translateY(100vh); }
        }
        @keyframes icon-fade-in {
          from { opacity: 0; transform: translateY(10px) }
          to { opacity: 1; transform: translateY(0) }
        }
        .animate-fade-in {
            animation: fadeIn 0.5s ease-out forwards;
        }
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        .neon-border {
            box-shadow: 0 0 5px hsl(var(--primary)),
                        0 0 10px hsl(var(--primary)),
                        0 0 20px hsl(var(--primary)),
                        inset 0 0 5px hsl(var(--primary));
        }
      `}</style>
    </div>
  );
}

    
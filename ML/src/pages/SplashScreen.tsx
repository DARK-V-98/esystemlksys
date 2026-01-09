import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Cpu, Zap, Shield, Wrench } from "lucide-react";

export default function SplashScreen() {
  const [phase, setPhase] = useState(0);
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    // Phase transitions
    const phases = [
      { delay: 500, next: 1 },   // Logo appears
      { delay: 1500, next: 2 },  // Text appears
      { delay: 2500, next: 3 },  // Loading bar
      { delay: 4000, next: 4 },  // Fade out
    ];

    phases.forEach(({ delay, next }) => {
      setTimeout(() => setPhase(next), delay);
    });

    // Progress bar animation
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 2;
      });
    }, 50);

    // Navigate after splash
    const timer = setTimeout(() => {
      const isAuthenticated = localStorage.getItem("isAuthenticated");
      navigate(isAuthenticated ? "/dashboard" : "/auth");
    }, 4500);

    return () => {
      clearTimeout(timer);
      clearInterval(progressInterval);
    };
  }, [navigate]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-black">
      {/* Animated Background */}
      <div className="absolute inset-0">
        {/* Grid pattern */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `linear-gradient(hsl(348 100% 50% / 0.3) 1px, transparent 1px),
                              linear-gradient(90deg, hsl(348 100% 50% / 0.3) 1px, transparent 1px)`,
            backgroundSize: '50px 50px',
          }}
        />
        
        {/* Glowing orbs */}
        <div className="absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-primary/20 blur-[100px] animate-pulse" />
        <div className="absolute right-1/4 bottom-1/4 h-80 w-80 rounded-full bg-primary/15 blur-[80px] animate-pulse" style={{ animationDelay: '0.5s' }} />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-primary/10 blur-[120px]" />
        
        {/* Scanning lines */}
        <div className="absolute inset-0 overflow-hidden">
          <div 
            className="absolute h-[2px] w-full bg-gradient-to-r from-transparent via-primary to-transparent opacity-50"
            style={{
              animation: 'scanLine 2s linear infinite',
              top: '20%',
            }}
          />
          <div 
            className="absolute h-[2px] w-full bg-gradient-to-r from-transparent via-primary to-transparent opacity-30"
            style={{
              animation: 'scanLine 2s linear infinite',
              animationDelay: '0.7s',
              top: '60%',
            }}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center">
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
          className={`mt-10 flex items-center gap-8 transition-all duration-1000 ${
            phase >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
          style={{ transitionDelay: '300ms' }}
        >
          {[
            { icon: Wrench, label: "Tools" },
            { icon: Zap, label: "Fast" },
            { icon: Shield, label: "Secure" },
          ].map((item, index) => (
            <div 
              key={item.label}
              className="flex flex-col items-center gap-2"
              style={{ animationDelay: `${index * 200}ms` }}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-primary/30 bg-primary/10">
                <item.icon className="h-6 w-6 text-primary" />
              </div>
              <span className="text-xs font-semibold text-white/50 uppercase tracking-wider">
                {item.label}
              </span>
            </div>
          ))}
        </div>

        {/* Loading Bar */}
        <div 
          className={`mt-12 w-80 transition-all duration-500 ${
            phase >= 3 ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-white/50 uppercase tracking-wider">
              Initializing System
            </span>
            <span className="text-xs font-bold text-primary">
              {progress}%
            </span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
            <div 
              className="h-full rounded-full gradient-primary shadow-glow transition-all duration-100"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="mt-3 text-center text-sm text-white/40">
            Loading components...
          </p>
        </div>

        {/* Version */}
        <p 
          className={`mt-8 text-xs font-medium text-white/30 transition-all duration-500 ${
            phase >= 2 ? 'opacity-100' : 'opacity-0'
          }`}
        >
          Version 1.0.0 • Powered by ESYSTEMLK
        </p>
      </div>

      {/* Fade out overlay */}
      <div 
        className={`absolute inset-0 bg-white transition-opacity duration-500 ${
          phase >= 4 ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* Custom styles */}
      <style>{`
        @keyframes scanLine {
          0% { transform: translateY(-100vh); }
          100% { transform: translateY(100vh); }
        }
      `}</style>
    </div>
  );
}

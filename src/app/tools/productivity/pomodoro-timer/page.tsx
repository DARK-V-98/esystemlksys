'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Timer, Play, Pause, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

export default function PomodoroTimerPage() {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<'work' | 'shortBreak' | 'longBreak'>('work');

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive) {
      interval = setInterval(() => {
        if (seconds > 0) {
          setSeconds(s => s - 1);
        } else if (minutes > 0) {
          setMinutes(m => m - 1);
          setSeconds(59);
        } else {
          // Timer finished
          setIsActive(false);
          toast.success("Session complete!");
          // Here you could add logic to auto-switch modes
        }
      }, 1000);
    } else if (!isActive && seconds !== 0) {
      if (interval) clearInterval(interval);
    }
    return () => { if (interval) clearInterval(interval) };
  }, [isActive, seconds, minutes]);
  
  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = () => {
    setIsActive(false);
    switch (mode) {
      case 'work': setMinutes(25); break;
      case 'shortBreak': setMinutes(5); break;
      case 'longBreak': setMinutes(15); break;
    }
    setSeconds(0);
  };
  
  const switchMode = (newMode: 'work' | 'shortBreak' | 'longBreak') => {
    setMode(newMode);
    setIsActive(false);
    switch (newMode) {
      case 'work': setMinutes(25); break;
      case 'shortBreak': setMinutes(5); break;
      case 'longBreak': setMinutes(15); break;
    }
    setSeconds(0);
  }

  return (
    <div className="space-y-6 animate-fade-in p-8">
      <div className="relative overflow-hidden gradient-dark p-8">
        <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-primary/20 blur-3xl" />
        <div className="relative flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl gradient-primary shadow-glow-intense">
            <Timer className="h-8 w-8 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-primary-foreground">
              Pomodoro <span className="text-primary neon-text">Timer</span>
            </h1>
            <p className="mt-1 text-primary-foreground/70">
              Stay focused and productive with timed work sessions.
            </p>
          </div>
        </div>
      </div>
      
      <div className="bg-card rounded-lg border shadow-sm p-6 space-y-6 max-w-2xl mx-auto">
        <Link href="/tools" className="inline-flex items-center justify-center gap-2 rounded-xl h-12 px-5 text-sm font-bold transition-all duration-200 bg-secondary text-secondary-foreground hover:bg-secondary/80 hover:text-primary">
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Tools</span>
        </Link>
        
        <div className="bg-secondary/50 border rounded-lg p-8 flex flex-col items-center gap-8">
            <div className="flex gap-2">
                <Button variant={mode==='work' ? 'gradient' : 'outline'} onClick={() => switchMode('work')}>Pomodoro (25 min)</Button>
                <Button variant={mode==='shortBreak' ? 'gradient' : 'outline'} onClick={() => switchMode('shortBreak')}>Short Break (5 min)</Button>
                <Button variant={mode==='longBreak' ? 'gradient' : 'outline'} onClick={() => switchMode('longBreak')}>Long Break (15 min)</Button>
            </div>

            <div className="font-mono text-8xl font-black text-primary neon-text">
                {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </div>

            <div className="flex gap-4">
                <Button onClick={toggleTimer} size="lg" className="w-40">
                    {isActive ? <><Pause className="mr-2 h-5 w-5"/>Pause</> : <><Play className="mr-2 h-5 w-5"/>Start</>}
                </Button>
                <Button onClick={resetTimer} variant="outline" size="lg"><RefreshCw className="mr-2 h-5 w-5"/>Reset</Button>
            </div>
        </div>
      </div>
    </div>
  );
}

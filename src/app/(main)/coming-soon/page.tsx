'use client'
import { useSearchParams } from 'next/navigation';
import { Construction, Rocket } from "lucide-react";
import { Suspense } from 'react';

function ComingSoonContent() {
  const searchParams = useSearchParams()
  const title = searchParams.get('title') || 'Page';

  return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center animate-fade-in">
        <div className="relative">
          <div className="flex h-24 w-24 items-center justify-center rounded-3xl gradient-primary shadow-glow-intense animate-pulse-glow">
            <Construction className="h-12 w-12 text-primary-foreground" />
          </div>
          <div className="absolute -bottom-2 -right-2 flex h-10 w-10 items-center justify-center rounded-xl bg-card border-2 border-primary shadow-glow">
            <Rocket className="h-5 w-5 text-primary" />
          </div>
        </div>
        
        <h1 className="mt-8 text-4xl font-black text-foreground">
          <span className="text-gradient">{title}</span>
        </h1>
        <p className="mt-4 max-w-md text-lg text-muted-foreground">
          This section is currently under development. Check back soon for exciting new features!
        </p>
        
        <div className="mt-8 flex items-center gap-2 rounded-full bg-secondary px-6 py-3">
          <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
          <span className="text-sm font-semibold text-muted-foreground">In Development</span>
        </div>
        
        <div className="mt-12 rounded-xl bg-secondary p-4">
          <p className="text-sm text-muted-foreground">
            Powered by <span className="font-black text-gradient">ESYSTEMLK</span>
          </p>
        </div>
      </div>
  );
}


export default function ComingSoon() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ComingSoonContent />
    </Suspense>
  );
}

'use client'
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useEffect } from 'react';
import TitleBar from '@/components/TitleBar';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => console.log('scope is: ', registration.scope));
    }
  }, []);

  return (
    <html lang="en" className="dark" style={{colorScheme: "dark"}}>
      <head>
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body>
          <TitleBar />
          <TooltipProvider>
            <Toaster />
            <Sonner />
            {children}
          </TooltipProvider>
      </body>
    </html>
  );
}

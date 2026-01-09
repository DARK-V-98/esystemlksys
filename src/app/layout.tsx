'use client'
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useEffect } from 'react';
import TitleBar from '@/components/TitleBar';
import { ThemeProvider } from '@/components/theme-provider';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.service-worker
        .register('/sw.js')
        .then((registration) => console.log('scope is: ', registration.scope));
    }
  }, []);

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className="flex flex-col h-screen overflow-hidden">
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <TitleBar />
            <TooltipProvider>
              <div className="flex-grow overflow-y-auto">
                <Toaster />
                <Sonner />
                {children}
              </div>
            </TooltipProvider>
          </ThemeProvider>
      </body>
    </html>
  );
}

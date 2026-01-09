'use client'
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useEffect } from 'react';
import TitleBar from '@/components/TitleBar';
import { ThemeProvider } from '@/components/theme-provider';
import Script from 'next/script';
import AdminNotificationListener from '@/components/AdminNotificationListener';

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
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <Script
          src="https://cdnjs.cloudflare.com/ajax/libs/jsmediatags/3.9.5/jsmediatags.min.js"
          strategy="beforeInteractive"
        />
      </head>
      <body className="flex flex-col h-screen overflow-hidden">
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <TitleBar />
            <AdminNotificationListener />
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

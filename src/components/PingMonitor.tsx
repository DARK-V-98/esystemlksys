'use client';
import { useEffect, useState } from 'react';
import { Signal, SignalHigh, SignalMedium, SignalLow } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Extended navigator type
interface NetworkInformation extends EventTarget {
  rtt: number;
  effectiveType: string;
  downlink: number;
}

const PingMonitor = () => {
  const [latency, setLatency] = useState<number | null>(null);
  const [isSupported, setIsSupported] = useState(true);

  useEffect(() => {
    const connection = (navigator as any).connection as NetworkInformation | undefined;

    if (!connection || typeof connection.rtt === 'undefined') {
      setIsSupported(false);
      setLatency(null); // Set a fake latency for display
      return;
    }

    const updateLatency = () => {
      setLatency(connection.rtt);
    };

    updateLatency(); // Initial check

    const interval = setInterval(updateLatency, 5000); // Check every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const getStatus = () => {
    if (latency === null) {
      return {
        color: 'text-muted-foreground',
        Icon: Signal,
        label: 'Unknown',
        tooltip: 'Network latency cannot be determined.'
      };
    }
    if (latency < 150) {
      return {
        color: 'text-success',
        Icon: SignalHigh,
        label: 'Good',
        tooltip: 'Your connection is fast and stable.'
      };
    }
    if (latency <= 300) {
      return {
        color: 'text-warning',
        Icon: SignalMedium,
        label: 'Fair',
        tooltip: 'Your connection is average. You may experience some delays.'
      };
    }
    return {
      color: 'text-destructive',
      Icon: SignalLow,
      label: 'Poor',
      tooltip: 'Your connection is slow. Performance may be affected.'
    };
  };

  const { color, Icon, label, tooltip } = getStatus();

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-2 rounded-full border bg-secondary/50 px-3 py-1.5 text-sm font-semibold">
            <Icon className={cn('h-5 w-5', color, latency !== null && 'animate-pulse')} style={{ animationDuration: '2s' }} />
            <span className={cn('font-mono', color)}>
              {latency !== null ? `${latency}ms` : '-- ms'}
            </span>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p><strong>Network Status:</strong> {label}</p>
          <p className="text-xs text-muted-foreground">{tooltip}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default PingMonitor;

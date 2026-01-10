'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Globe2, X, Plus } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

const timezones = Intl.supportedValuesOf('timeZone');

const defaultZones = ['UTC', 'America/New_York', 'Europe/London', 'Asia/Tokyo'];

export default function TimeZoneConverterPage() {
  const [baseTime, setBaseTime] = useState(new Date());
  const [selectedZones, setSelectedZones] = useState<string[]>(defaultZones);

  useEffect(() => {
    const timer = setInterval(() => setBaseTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const addZone = (zone: string) => {
    if (!selectedZones.includes(zone)) {
      setSelectedZones([...selectedZones, zone]);
    } else {
      toast.warning('Timezone already added.');
    }
  };

  const removeZone = (zoneToRemove: string) => {
    setSelectedZones(selectedZones.filter(zone => zone !== zoneToRemove));
  };
  
  const getFormattedTime = (date: Date, timeZone: string) => {
    try {
      return new Intl.DateTimeFormat('en-US', {
        timeZone,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      }).format(date);
    } catch(e) {
      return 'Invalid Zone';
    }
  }

  const getFormattedDate = (date: Date, timeZone: string) => {
    try {
      return new Intl.DateTimeFormat('en-US', {
        timeZone,
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      }).format(date);
    } catch (e) {
        return '';
    }
  }


  return (
    <div className="space-y-6 animate-fade-in p-8">
      <div className="relative overflow-hidden gradient-dark p-8">
        <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-primary/20 blur-3xl" />
        <div className="relative flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl gradient-primary shadow-glow-intense">
            <Globe2 className="h-8 w-8 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-primary-foreground">
              Time Zone <span className="text-primary neon-text">Converter</span>
            </h1>
            <p className="mt-1 text-primary-foreground/70">
              Compare the time across different parts of the world.
            </p>
          </div>
        </div>
      </div>
      
      <div className="bg-card rounded-lg border shadow-sm p-6 space-y-6">
        <Link href="/tools" className="inline-flex items-center justify-center gap-2 rounded-xl h-12 px-5 text-sm font-bold transition-all duration-200 bg-secondary text-secondary-foreground hover:bg-secondary/80 hover:text-primary">
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Tools</span>
        </Link>
        
        <div className="bg-secondary/50 border rounded-lg p-6 space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
                <Select onValueChange={addZone}>
                    <SelectTrigger className="w-full sm:w-[300px]">
                        <SelectValue placeholder="Add a timezone..." />
                    </SelectTrigger>
                    <SelectContent>
                        {timezones.map(tz => <SelectItem key={tz} value={tz}>{tz}</SelectItem>)}
                    </SelectContent>
                </Select>
                <Button onClick={() => setSelectedZones(defaultZones)} variant="outline">Reset to Defaults</Button>
            </div>
            <div className="space-y-3 pt-4">
                {selectedZones.map(zone => (
                    <div key={zone} className="grid grid-cols-[1fr_auto_auto] items-center gap-4 p-3 bg-card rounded-lg border">
                        <div>
                            <p className="font-bold text-lg">{zone.replace(/_/g, ' ')}</p>
                            <p className="text-sm text-muted-foreground">{getFormattedDate(baseTime, zone)}</p>
                        </div>
                         <p className="font-mono text-xl sm:text-3xl font-bold text-primary">{getFormattedTime(baseTime, zone)}</p>
                        <Button variant="ghost" size="icon" className="text-destructive h-8 w-8" onClick={() => removeZone(zone)}>
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
}

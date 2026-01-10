'use client';
import { useState, useMemo } from 'react';
import Link from 'next/link';
import { ArrowLeft, Percent } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

function PercentageCalculator() {
    const [val1, setVal1] = useState(10);
    const [val2, setVal2] = useState(50);
    const result = useMemo(() => (val1 / 100) * val2, [val1, val2]);

    return (
        <div className="space-y-4">
            <p className="text-center">What is {val1}% of {val2}?</p>
            <div className="grid grid-cols-2 gap-4">
                <Input type="number" value={val1} onChange={e => setVal1(Number(e.target.value))} />
                <Input type="number" value={val2} onChange={e => setVal2(Number(e.target.value))} />
            </div>
            <Card className="text-center p-4 bg-background"><p className="text-3xl font-bold text-primary">{result.toLocaleString()}</p></Card>
        </div>
    );
}

function IsWhatPercentOf() {
    const [val1, setVal1] = useState(10);
    const [val2, setVal2] = useState(200);
    const result = useMemo(() => (val1 / val2) * 100, [val1, val2]);

    return (
        <div className="space-y-4">
            <p className="text-center">{val1} is what percent of {val2}?</p>
            <div className="grid grid-cols-2 gap-4">
                <Input type="number" value={val1} onChange={e => setVal1(Number(e.target.value))} />
                <Input type="number" value={val2} onChange={e => setVal2(Number(e.target.value))} />
            </div>
            <Card className="text-center p-4 bg-background"><p className="text-3xl font-bold text-primary">{result.toFixed(2)}%</p></Card>
        </div>
    );
}

function PercentChange() {
    const [val1, setVal1] = useState(100);
    const [val2, setVal2] = useState(150);
    const result = useMemo(() => ((val2 - val1) / val1) * 100, [val1, val2]);
    const changeType = result > 0 ? 'increase' : 'decrease';

    return (
        <div className="space-y-4">
            <p className="text-center">What is the % change from {val1} to {val2}?</p>
            <div className="grid grid-cols-2 gap-4">
                <Input type="number" value={val1} onChange={e => setVal1(Number(e.target.value))} />
                <Input type="number" value={val2} onChange={e => setVal2(Number(e.target.value))} />
            </div>
            <Card className="text-center p-4 bg-background">
                <p className={`text-3xl font-bold ${result > 0 ? 'text-success' : 'text-destructive'}`}>
                    {result.toFixed(2)}% {changeType}
                </p>
            </Card>
        </div>
    );
}


export default function PercentageCalculatorPage() {
  return (
    <div className="space-y-6 animate-fade-in p-8">
      <div className="relative overflow-hidden gradient-dark p-8">
        <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-primary/20 blur-3xl" />
        <div className="relative flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl gradient-primary shadow-glow-intense">
            <Percent className="h-8 w-8 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-primary-foreground">
              Percentage <span className="text-primary neon-text">Calculator</span>
            </h1>
            <p className="mt-1 text-primary-foreground/70">
              A versatile tool for all your percentage calculations.
            </p>
          </div>
        </div>
      </div>
      
      <div className="bg-card rounded-lg border shadow-sm p-6 space-y-6">
        <Link href="/tools" className="inline-flex items-center justify-center gap-2 rounded-xl h-12 px-5 text-sm font-bold transition-all duration-200 bg-secondary text-secondary-foreground hover:bg-secondary/80 hover:text-primary">
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Tools</span>
        </Link>
        
         <div className="bg-secondary/50 border rounded-lg p-6 max-w-xl mx-auto">
            <Tabs defaultValue="percentOf" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="percentOf">% of X</TabsTrigger>
                    <TabsTrigger value="isWhatPercent">X is % of Y</TabsTrigger>
                    <TabsTrigger value="change">% Change</TabsTrigger>
                </TabsList>
                <TabsContent value="percentOf" className="mt-6"><PercentageCalculator /></TabsContent>
                <TabsContent value="isWhatPercent" className="mt-6"><IsWhatPercentOf /></TabsContent>
                <TabsContent value="change" className="mt-6"><PercentChange /></TabsContent>
            </Tabs>
         </div>
      </div>
    </div>
  );
}

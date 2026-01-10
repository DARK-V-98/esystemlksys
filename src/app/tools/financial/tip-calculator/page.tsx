'use client';
import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Calculator, User } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const tipPercentages = [10, 15, 18, 20, 25];

export default function TipCalculatorPage() {
  const [bill, setBill] = useState<number | ''>(50);
  const [tipPercent, setTipPercent] = useState(15);
  const [people, setPeople] = useState<number | ''>(1);

  const tipAmount = (bill !== '' && tipPercent !== null) ? (bill * tipPercent) / 100 : 0;
  const totalAmount = (bill !== '') ? bill + tipAmount : 0;
  const perPersonAmount = (people !== '' && people > 0) ? totalAmount / people : totalAmount;


  return (
    <div className="space-y-6 animate-fade-in p-8">
      <div className="relative overflow-hidden gradient-dark p-8">
        <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-primary/20 blur-3xl" />
        <div className="relative flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl gradient-primary shadow-glow-intense">
            <Calculator className="h-8 w-8 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-primary-foreground">
              Tip <span className="text-primary neon-text">Calculator</span>
            </h1>
            <p className="mt-1 text-primary-foreground/70">
              Quickly calculate the tip and total per person.
            </p>
          </div>
        </div>
      </div>
      
      <div className="bg-card rounded-lg border shadow-sm p-6 space-y-6">
        <Link href="/tools" className="inline-flex items-center justify-center gap-2 rounded-xl h-12 px-5 text-sm font-bold transition-all duration-200 bg-secondary text-secondary-foreground hover:bg-secondary/80 hover:text-primary">
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Tools</span>
        </Link>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            <div className="bg-secondary/50 border rounded-lg p-6 space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="bill-amount" className="text-lg">Bill Amount ($)</Label>
                    <Input id="bill-amount" type="number" value={bill} onChange={e => setBill(e.target.value === '' ? '' : Number(e.target.value))} className="h-14 text-2xl" />
                </div>
                <div className="space-y-2">
                    <Label className="text-lg">Select Tip %</Label>
                    <div className="grid grid-cols-3 gap-2">
                        {tipPercentages.map(p => (
                             <Button key={p} variant={tipPercent === p ? 'default' : 'outline'} onClick={() => setTipPercent(p)} className="h-12 text-lg">
                                {p}%
                            </Button>
                        ))}
                         <Input type="number" placeholder="Custom" value={tipPercent} onChange={e => setTipPercent(e.target.value === '' ? 0 : Number(e.target.value))} className="h-12 text-lg text-center" />
                    </div>
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="people" className="text-lg">Number of People</Label>
                    <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input id="people" type="number" value={people} onChange={e => setPeople(e.target.value === '' ? '' : Math.max(1, Number(e.target.value)))} className="h-14 text-2xl pl-10" />
                    </div>
                </div>
            </div>
             <div className="space-y-4 bg-primary/90 text-primary-foreground p-6 rounded-lg">
                <div className="flex justify-between items-center">
                    <div>
                        <p className="font-bold">Tip Amount</p>
                        <p className="text-sm opacity-80">/ person</p>
                    </div>
                    <p className="text-3xl font-bold">${(tipAmount / (people || 1)).toFixed(2)}</p>
                </div>
                <div className="flex justify-between items-center">
                    <div>
                        <p className="font-bold">Total</p>
                        <p className="text-sm opacity-80">/ person</p>
                    </div>
                    <p className="text-5xl font-extrabold">${perPersonAmount.toFixed(2)}</p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}

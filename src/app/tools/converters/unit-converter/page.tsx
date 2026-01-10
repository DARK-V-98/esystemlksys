'use client';
import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Scale, ArrowRightLeft } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const conversionFactors: Record<string, Record<string, number>> = {
  length: { m: 1, km: 1000, cm: 0.01, mm: 0.001, mi: 1609.34, ft: 0.3048, in: 0.0254 },
  weight: { kg: 1, g: 0.001, mg: 0.000001, lb: 0.453592, oz: 0.0283495 },
  temperature: {}, // Special case
};

const unitLabels: Record<string, string> = {
  m: 'Meter', km: 'Kilometer', cm: 'Centimeter', mm: 'Millimeter', mi: 'Mile', ft: 'Foot', in: 'Inch',
  kg: 'Kilogram', g: 'Gram', mg: 'Milligram', lb: 'Pound', oz: 'Ounce',
  c: 'Celsius', f: 'Fahrenheit', k: 'Kelvin'
};


const UnitConverterTab = ({ category }: { category: keyof typeof conversionFactors | 'temperature' }) => {
    const [fromValue, setFromValue] = useState('1');
    const [fromUnit, setFromUnit] = useState(Object.keys(conversionFactors[category] || {c:0,f:0,k:0})[0]);
    const [toUnit, setToUnit] = useState(Object.keys(conversionFactors[category] || {c:0,f:0,k:0})[1]);

    const convert = () => {
        const value = parseFloat(fromValue);
        if (isNaN(value)) return '';

        if (category === 'temperature') {
            if (fromUnit === 'c') {
                if (toUnit === 'f') return (value * 9/5) + 32;
                if (toUnit === 'k') return value + 273.15;
            }
            if (fromUnit === 'f') {
                if (toUnit === 'c') return (value - 32) * 5/9;
                if (toUnit === 'k') return (value - 32) * 5/9 + 273.15;
            }
            if (fromUnit === 'k') {
                if (toUnit === 'c') return value - 273.15;
                if (toUnit === 'f') return (value - 273.15) * 9/5 + 32;
            }
            return value;
        } else {
            const baseValue = value * conversionFactors[category][fromUnit];
            const result = baseValue / conversionFactors[category][toUnit];
            return result;
        }
    };
    
    const toValue = convert();

    const swapUnits = () => {
      const oldFromUnit = fromUnit;
      setFromUnit(toUnit);
      setToUnit(oldFromUnit);
      if (typeof toValue === 'number') {
        setFromValue(toValue.toString());
      }
    };

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                    <Label>From</Label>
                    <Input type="number" value={fromValue} onChange={e => setFromValue(e.target.value)} />
                    <Select value={fromUnit} onValueChange={setFromUnit}>
                      <SelectTrigger><SelectValue/></SelectTrigger>
                      <SelectContent>
                        {Object.keys(conversionFactors[category] || {c:'',f:'',k:''}).map(u => <SelectItem key={u} value={u}>{unitLabels[u]}</SelectItem>)}
                      </SelectContent>
                    </Select>
                </div>
                <div className="space-y-1">
                    <Label>To</Label>
                    <Input readOnly value={typeof toValue === 'number' ? toValue.toFixed(4) : toValue} className="bg-muted font-bold" />
                     <Select value={toUnit} onValueChange={setToUnit}>
                      <SelectTrigger><SelectValue/></SelectTrigger>
                      <SelectContent>
                        {Object.keys(conversionFactors[category] || {c:'',f:'',k:''}).map(u => <SelectItem key={u} value={u}>{unitLabels[u]}</SelectItem>)}
                      </SelectContent>
                    </Select>
                </div>
            </div>
            <div className="flex justify-center">
              <button onClick={swapUnits} className="p-2 rounded-full hover:bg-muted"><ArrowRightLeft className="h-5 w-5"/></button>
            </div>
        </div>
    );
};


export default function UnitConverterPage() {
  return (
    <div className="space-y-6 animate-fade-in p-8">
      <div className="relative overflow-hidden gradient-dark p-8">
        <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-primary/20 blur-3xl" />
        <div className="relative flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl gradient-primary shadow-glow-intense">
            <Scale className="h-8 w-8 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-primary-foreground">
              Unit <span className="text-primary neon-text">Converter</span>
            </h1>
            <p className="mt-1 text-primary-foreground/70">
              Convert between various units of measurement.
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
            <Tabs defaultValue="length" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="length">Length</TabsTrigger>
                    <TabsTrigger value="weight">Weight</TabsTrigger>
                    <TabsTrigger value="temperature">Temperature</TabsTrigger>
                </TabsList>
                <TabsContent value="length" className="mt-6"><UnitConverterTab category="length"/></TabsContent>
                <TabsContent value="weight" className="mt-6"><UnitConverterTab category="weight"/></TabsContent>
                <TabsContent value="temperature" className="mt-6"><UnitConverterTab category="temperature"/></TabsContent>
            </Tabs>
        </div>
      </div>
    </div>
  );
}

'use client';
import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, CircleDollarSign } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';

export default function DiscountCalculatorPage() {
  const [originalPrice, setOriginalPrice] = useState<number | ''>(100);
  const [discount, setDiscount] = useState<number | ''>(20);

  const savedAmount = (originalPrice !== '' && discount !== '') ? (originalPrice * discount) / 100 : 0;
  const finalPrice = (originalPrice !== '') ? originalPrice - savedAmount : 0;

  return (
    <div className="space-y-6 animate-fade-in p-8">
      <div className="relative overflow-hidden gradient-dark p-8">
        <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-primary/20 blur-3xl" />
        <div className="relative flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl gradient-primary shadow-glow-intense">
            <CircleDollarSign className="h-8 w-8 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-primary-foreground">
              Discount <span className="text-primary neon-text">Calculator</span>
            </h1>
            <p className="mt-1 text-primary-foreground/70">
              Quickly calculate the final price after a discount.
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
                    <Label htmlFor="original-price" className="text-lg">Original Price ($)</Label>
                    <Input id="original-price" type="number" value={originalPrice} onChange={e => setOriginalPrice(e.target.value === '' ? '' : Number(e.target.value))} className="h-14 text-2xl" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="discount" className="text-lg">Discount (%)</Label>
                    <Input id="discount" type="number" value={discount} onChange={e => setDiscount(e.target.value === '' ? '' : Number(e.target.value))} className="h-14 text-2xl" />
                </div>
            </div>
             <div className="space-y-4">
                <Card className="text-center p-6">
                    <p className="text-sm font-medium text-muted-foreground">YOU SAVE</p>
                    <p className="text-4xl font-bold text-destructive">${savedAmount.toFixed(2)}</p>
                </Card>
                 <Card className="text-center p-6">
                    <p className="text-sm font-medium text-muted-foreground">FINAL PRICE</p>
                    <p className="text-5xl font-bold text-success">${finalPrice.toFixed(2)}</p>
                </Card>
            </div>
        </div>
      </div>
    </div>
  );
}

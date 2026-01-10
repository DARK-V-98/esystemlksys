'use client';
import { useState, useMemo } from 'react';
import Link from 'next/link';
import { ArrowLeft, Landmark, Percent, CircleDollarSign, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function LoanCalculatorPage() {
  const [principal, setPrincipal] = useState(100000);
  const [interestRate, setInterestRate] = useState(5);
  const [loanTerm, setLoanTerm] = useState(30);

  const { monthlyPayment, totalPayment, totalInterest, schedule } = useMemo(() => {
    const P = principal;
    const r = interestRate / 100 / 12;
    const n = loanTerm * 12;

    if (P <= 0 || r < 0 || n <= 0) {
      return { monthlyPayment: 0, totalPayment: 0, totalInterest: 0, schedule: [] };
    }
    
    let M;
    if (r === 0) { // Interest-free loan
        M = P / n;
    } else {
        M = P * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    }
    
    const totalPayment = M * n;
    const totalInterest = totalPayment - P;

    const newSchedule = [];
    let balance = P;
    for (let i = 1; i <= n; i++) {
        const interest = balance * r;
        const principalPaid = M - interest;
        balance -= principalPaid;
        newSchedule.push({
            month: i,
            interest: interest,
            principal: principalPaid,
            balance: balance > 0 ? balance : 0
        });
    }

    return {
      monthlyPayment: M,
      totalPayment,
      totalInterest,
      schedule: newSchedule,
    };
  }, [principal, interestRate, loanTerm]);

  return (
    <div className="space-y-6 animate-fade-in p-8">
      <div className="relative overflow-hidden gradient-dark p-8">
        <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-primary/20 blur-3xl" />
        <div className="relative flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl gradient-primary shadow-glow-intense">
            <Landmark className="h-8 w-8 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-primary-foreground">
              Loan <span className="text-primary neon-text">Calculator</span>
            </h1>
            <p className="mt-1 text-primary-foreground/70">
              Calculate monthly payments, total interest, and amortization.
            </p>
          </div>
        </div>
      </div>
      
      <div className="bg-card rounded-lg border shadow-sm p-6 space-y-6">
        <Link href="/tools" className="inline-flex items-center justify-center gap-2 rounded-xl h-12 px-5 text-sm font-bold transition-all duration-200 bg-secondary text-secondary-foreground hover:bg-secondary/80 hover:text-primary">
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Tools</span>
        </Link>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 bg-secondary/50 border rounded-lg p-6 space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="principal">Loan Amount ($)</Label>
                    <Input id="principal" type="number" value={principal} onChange={e => setPrincipal(Number(e.target.value))} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="interest">Annual Interest Rate (%)</Label>
                    <Input id="interest" type="number" value={interestRate} onChange={e => setInterestRate(Number(e.target.value))} />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="term">Loan Term (Years)</Label>
                    <Input id="term" type="number" value={loanTerm} onChange={e => setLoanTerm(Number(e.target.value))} />
                </div>
            </div>
            <div className="lg:col-span-2 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Monthly Payment</CardTitle>
                            <CircleDollarSign className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent><div className="text-2xl font-bold">${monthlyPayment.toFixed(2)}</div></CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Payment</CardTitle>
                            <Landmark className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent><div className="text-2xl font-bold">${totalPayment.toFixed(2)}</div></CardContent>
                    </Card>
                     <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Interest</CardTitle>
                            <Percent className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent><div className="text-2xl font-bold text-destructive">${totalInterest.toFixed(2)}</div></CardContent>
                    </Card>
                </div>
                <Card>
                    <CardHeader><CardTitle>Amortization Schedule</CardTitle></CardHeader>
                    <CardContent>
                        <ScrollArea className="h-72">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Month</TableHead>
                                        <TableHead>Principal</TableHead>
                                        <TableHead>Interest</TableHead>
                                        <TableHead>Balance</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {schedule.map(row => (
                                        <TableRow key={row.month}>
                                            <TableCell>{row.month}</TableCell>
                                            <TableCell>${row.principal.toFixed(2)}</TableCell>
                                            <TableCell>${row.interest.toFixed(2)}</TableCell>
                                            <TableCell>${row.balance.toFixed(2)}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </ScrollArea>
                    </CardContent>
                </Card>
            </div>
        </div>
      </div>
    </div>
  );
}

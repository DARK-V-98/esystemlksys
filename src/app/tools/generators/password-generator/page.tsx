'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { ArrowLeft, KeyRound, RefreshCw, Clipboard, Check } from 'lucide-react';
import { toast } from 'sonner';

const lowerCaseChars = "abcdefghijklmnopqrstuvwxyz";
const upperCaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const numberChars = "0123456789";
const symbolChars = "!@#$%^&*()_+-=[]{}|;:,.<>?";

export default function PasswordGeneratorPage() {
  const [password, setPassword] = useState('');
  const [length, setLength] = useState(16);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [copied, setCopied] = useState(false);

  const generatePassword = () => {
    let charSet = lowerCaseChars;
    if (includeUppercase) charSet += upperCaseChars;
    if (includeNumbers) charSet += numberChars;
    if (includeSymbols) charSet += symbolChars;

    if (charSet.length === 0) {
        toast.error("You must include at least one character type.");
        setPassword('');
        return;
    }

    let newPassword = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charSet.length);
      newPassword += charSet[randomIndex];
    }
    setPassword(newPassword);
    toast.success("New password generated!");
    setCopied(false);
  };
  
  useEffect(() => {
    generatePassword();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [length, includeUppercase, includeNumbers, includeSymbols]);

  const handleCopy = () => {
    if (!password) return;
    navigator.clipboard.writeText(password);
    setCopied(true);
    toast.success("Password copied to clipboard!");
  };

  return (
    <div className="space-y-6 animate-fade-in p-8">
      <div className="relative overflow-hidden gradient-dark p-8">
        <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-primary/20 blur-3xl" />
        <div className="relative flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl gradient-primary shadow-glow-intense">
            <KeyRound className="h-8 w-8 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-primary-foreground">
              Password <span className="text-primary neon-text">Generator</span>
            </h1>
            <p className="mt-1 text-primary-foreground/70">
              Create strong, secure, and random passwords.
            </p>
          </div>
        </div>
      </div>
      
      <div className="bg-card rounded-lg border shadow-sm p-6 space-y-6 max-w-2xl mx-auto">
        <Link href="/tools" className="inline-flex items-center justify-center gap-2 rounded-xl h-12 px-5 text-sm font-bold transition-all duration-200 bg-secondary text-secondary-foreground hover:bg-secondary/80 hover:text-primary">
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Tools</span>
        </Link>
        
        <div className="bg-secondary/50 border rounded-lg p-6 space-y-6">
            <div className="relative">
                <Input
                    readOnly
                    value={password}
                    className="h-16 text-2xl font-mono text-center pr-24"
                    placeholder="Generating..."
                />
                <div className="absolute top-1/2 right-2 -translate-y-1/2 flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={handleCopy}>
                        {copied ? <Check className="h-6 w-6 text-success" /> : <Clipboard className="h-6 w-6" />}
                    </Button>
                    <Button variant="ghost" size="icon" onClick={generatePassword}>
                        <RefreshCw className="h-6 w-6" />
                    </Button>
                </div>
            </div>

            <div className="space-y-4">
                <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <Label htmlFor="length">Password Length</Label>
                        <span className="font-bold text-primary">{length}</span>
                    </div>
                    <Slider
                        id="length"
                        min={8}
                        max={64}
                        step={1}
                        value={[length]}
                        onValueChange={(val) => setLength(val[0])}
                    />
                </div>
                <div className="flex items-center justify-between">
                    <Label htmlFor="uppercase">Include Uppercase (A-Z)</Label>
                    <Switch id="uppercase" checked={includeUppercase} onCheckedChange={setIncludeUppercase} />
                </div>
                 <div className="flex items-center justify-between">
                    <Label htmlFor="numbers">Include Numbers (0-9)</Label>
                    <Switch id="numbers" checked={includeNumbers} onCheckedChange={setIncludeNumbers} />
                </div>
                 <div className="flex items-center justify-between">
                    <Label htmlFor="symbols">Include Symbols (!@#...)</Label>
                    <Switch id="symbols" checked={includeSymbols} onCheckedChange={setIncludeSymbols} />
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Receipt, Trash2, Plus, Download, Palette, Upload, RefreshCcw, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { getAuth, onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { getFirestore, doc, setDoc, serverTimestamp } from "firebase/firestore";
import { app } from "@/firebase/config";

interface BillItem {
  id: number;
  description: string;
  quantity: number;
  price: number;
}

const initialItems: BillItem[] = [{ id: 1, description: 'Item Description', quantity: 1, price: 100 }];
const initialYourCompany = 'Your Company';
const initialYourAddress = '123 Street, City, Country';
const initialClientCompany = 'Client Company';
const initialClientAddress = '456 Avenue, Town, Country';
const initialInvoiceNumber = `INV-${Date.now().toString().slice(-6)}`;
const initialInvoiceDate = new Date().toISOString().slice(0, 10);
const initialDueDate = new Date(new Date().setDate(new Date().getDate() + 30)).toISOString().slice(0, 10);
const initialTax = 10;
const initialAccentColor = '#E60023';


export default function BillGeneratorPage() {
  const [logo, setLogo] = useState<string | null>(null);
  const [yourCompany, setYourCompany] = useState(initialYourCompany);
  const [yourAddress, setYourAddress] = useState(initialYourAddress);
  const [clientCompany, setClientCompany] = useState(initialClientCompany);
  const [clientAddress, setClientAddress] = useState(initialClientAddress);
  const [invoiceNumber, setInvoiceNumber] = useState(initialInvoiceNumber);
  const [invoiceDate, setInvoiceDate] = useState(initialInvoiceDate);
  const [dueDate, setDueDate] = useState(initialDueDate);
  const [items, setItems] = useState<BillItem[]>(initialItems);
  const [tax, setTax] = useState(initialTax);
  const [accentColor, setAccentColor] = useState(initialAccentColor);

  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const billPreviewRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // Load data from localStorage on initial render
  useEffect(() => {
    try {
        const savedData = localStorage.getItem('billGeneratorData');
        if (savedData) {
            const parsedData = JSON.parse(savedData);
            setYourCompany(parsedData.yourCompany || initialYourCompany);
            setYourAddress(parsedData.yourAddress || initialYourAddress);
            setClientCompany(parsedData.clientCompany || initialClientCompany);
            setClientAddress(parsedData.clientAddress || initialClientAddress);
            setInvoiceNumber(parsedData.invoiceNumber || initialInvoiceNumber);
            setInvoiceDate(parsedData.invoiceDate || initialInvoiceDate);
            setDueDate(parsedData.dueDate || initialDueDate);
            setItems(parsedData.items && parsedData.items.length > 0 ? parsedData.items : initialItems);
            setTax(parsedData.tax || initialTax);
            setAccentColor(parsedData.accentColor || initialAccentColor);
        }
    } catch (error) {
        console.error("Failed to load data from local storage", error);
        toast.error("Could not load your saved data.");
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    const dataToSave = {
        yourCompany,
        yourAddress,
        clientCompany,
        clientAddress,
        invoiceNumber,
        invoiceDate,
        dueDate,
        items,
        tax,
        accentColor
    };
    try {
        localStorage.setItem('billGeneratorData', JSON.stringify(dataToSave));
    } catch (error) {
        console.error("Failed to save data to local storage", error);
    }
  }, [yourCompany, yourAddress, clientCompany, clientAddress, invoiceNumber, invoiceDate, dueDate, items, tax, accentColor]);


  const subtotal = items.reduce((acc, item) => acc + item.quantity * item.price, 0);
  const taxAmount = (subtotal * tax) / 100;
  const total = subtotal + taxAmount;

  const handleItemChange = (id: number, field: keyof BillItem, value: string | number) => {
    setItems(items.map(item =>
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const addItem = () => {
    setItems([...items, { id: Date.now(), description: 'New Item', quantity: 1, price: 0 }]);
  };

  const removeItem = (id: number) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    } else {
      toast.error('You must have at least one item.');
    }
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogo(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const downloadPDF = async () => {
    const billElement = billPreviewRef.current;
    if (!billElement) return;

    toast.info('Generating PDF...');

    try {
        const canvas = await html2canvas(billElement, {
            scale: 2,
            useCORS: true,
            backgroundColor: null,
        });
        
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
            orientation: 'p',
            unit: 'px',
            format: [canvas.width, canvas.height]
        });

        pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
        pdf.save(`invoice-${invoiceNumber}.pdf`);
        toast.success('PDF downloaded successfully!');
    } catch (error) {
        console.error("Error generating PDF:", error);
        toast.error('Failed to generate PDF. See console for details.');
    }
  };

  const resetFields = () => {
      setYourCompany(initialYourCompany);
      setYourAddress(initialYourAddress);
      setClientCompany(initialClientCompany);
      setClientAddress(initialClientAddress);
      setInvoiceNumber(initialInvoiceNumber);
      setInvoiceDate(initialInvoiceDate);
      setDueDate(initialDueDate);
      setItems(initialItems);
      setTax(initialTax);
      setAccentColor(initialAccentColor);
      setLogo(null);
      localStorage.removeItem('billGeneratorData');
      toast.success("Form fields have been reset.");
  }
  
  const saveBillToFirestore = async () => {
    if (!user) {
        toast.error("You must be logged in to save a bill.");
        return;
    }
    setIsSaving(true);
    toast.info("Saving bill to your account...");

    const billData = {
        yourCompany,
        yourAddress,
        clientCompany,
        clientAddress,
        invoiceNumber,
        invoiceDate,
        dueDate,
        items,
        tax,
        accentColor,
        subtotal,
        taxAmount,
        total,
    };
    
    try {
        const db = getFirestore(app);
        const billRef = doc(db, 'users', user.uid, 'bills', invoiceNumber);
        await setDoc(billRef, {
            id: invoiceNumber,
            userId: user.uid,
            data: JSON.stringify(billData),
            createdAt: serverTimestamp(),
        });
        toast.success("Bill saved successfully!");
    } catch(error) {
        console.error("Error saving bill:", error);
        toast.error("Failed to save bill. See console for details.");
    } finally {
        setIsSaving(false);
    }
  };


  return (
    <div className="space-y-6 animate-fade-in">
      <div className="relative overflow-hidden gradient-dark p-8">
        <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-primary/20 blur-3xl" />
        <div className="relative flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl gradient-primary shadow-glow-intense">
            <Receipt className="h-8 w-8 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-primary-foreground">
              Bill <span className="text-primary neon-text">Generator</span>
            </h1>
            <p className="mt-1 text-primary-foreground/70">
              Create and customize professional bills and receipts.
            </p>
          </div>
        </div>
      </div>
      
      <div className="bg-card rounded-lg border shadow-sm p-6 space-y-6">
        <div className="flex flex-wrap gap-2 justify-between items-center">
            <Link href="/advanced-tools" className="inline-flex items-center justify-center gap-2 rounded-xl h-12 px-5 text-sm font-bold transition-all duration-200 bg-secondary text-secondary-foreground hover:bg-secondary/80 hover:text-primary">
                <ArrowLeft className="h-5 w-5" />
                <span>Back to Advanced Tools</span>
            </Link>
            <div className="flex gap-2">
                <Button onClick={saveBillToFirestore} disabled={!user || isSaving}>
                    <Save className="mr-2 h-5 w-5"/>
                    {isSaving ? 'Saving...' : 'Save Bill'}
                </Button>
                <Button onClick={downloadPDF} variant="gradient">
                    <Download className="mr-2 h-5 w-5"/>
                    Download PDF
                </Button>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Controller Panel */}
            <ScrollArea className="lg:col-span-1 h-[70vh] rounded-lg border p-4 shadow-inner bg-secondary/30">
                <div className="space-y-6">
                    <div>
                        <h3 className="font-bold text-lg mb-2">Design</h3>
                        <div className="space-y-4">
                            <Button onClick={() => fileInputRef.current?.click()} className="w-full">
                                <Upload className="mr-2 h-4 w-4"/>
                                {logo ? 'Change Logo' : 'Upload Logo'}
                            </Button>
                            <input type="file" ref={fileInputRef} onChange={handleLogoUpload} accept="image/*" className="hidden"/>
                            <div className="flex items-center gap-2">
                                <Label htmlFor="accent-color" className="flex items-center gap-2 cursor-pointer">
                                    <Palette className="h-5 w-5"/> Accent Color
                                </Label>
                                <Input id="accent-color" type="color" value={accentColor} onChange={(e) => setAccentColor(e.target.value)} className="h-8 w-12 p-1"/>
                            </div>
                             <Button onClick={resetFields} className="w-full" variant="outline">
                                <RefreshCcw className="mr-2 h-4 w-4"/>
                                Reset Fields
                            </Button>
                        </div>
                    </div>
                    <Separator/>
                    <div>
                        <h3 className="font-bold text-lg mb-2">Your Details</h3>
                        <div className="space-y-2">
                            <Input placeholder="Your Company" value={yourCompany} onChange={(e) => setYourCompany(e.target.value)} />
                            <Textarea placeholder="Your Address" value={yourAddress} onChange={(e) => setYourAddress(e.target.value)} rows={2}/>
                        </div>
                    </div>
                    <Separator/>
                     <div>
                        <h3 className="font-bold text-lg mb-2">Client Details</h3>
                        <div className="space-y-2">
                            <Input placeholder="Client Company" value={clientCompany} onChange={(e) => setClientCompany(e.target.value)} />
                            <Textarea placeholder="Client Address" value={clientAddress} onChange={(e) => setClientAddress(e.target.value)} rows={2}/>
                        </div>
                    </div>
                    <Separator/>
                     <div>
                        <h3 className="font-bold text-lg mb-2">Invoice Info</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <Input placeholder="Invoice #" value={invoiceNumber} onChange={(e) => setInvoiceNumber(e.target.value)} />
                            <Input type="date" value={invoiceDate} onChange={(e) => setInvoiceDate(e.target.value)} />
                            <Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
                        </div>
                    </div>
                </div>
            </ScrollArea>
            {/* Preview Panel */}
            <div className="lg:col-span-2 rounded-lg p-8 bg-white text-black shadow-elevated">
              <div ref={billPreviewRef} className="p-4 bg-white">
                <div className="flex justify-between items-start mb-8">
                    <div className="flex items-center gap-4">
                        {logo && <Image src={logo} alt="company logo" width={80} height={80} className="object-contain" />}
                        <div>
                            <h1 className="text-2xl font-bold" style={{ color: accentColor }}>{yourCompany}</h1>
                            <p className="text-xs whitespace-pre-line">{yourAddress}</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <h2 className="text-3xl font-bold uppercase">Invoice</h2>
                        <p className="text-sm"># {invoiceNumber}</p>
                    </div>
                </div>

                <div className="flex justify-between mb-8">
                    <div>
                        <h3 className="font-bold mb-1">Bill To:</h3>
                        <p className="font-semibold">{clientCompany}</p>
                        <p className="text-xs whitespace-pre-line">{clientAddress}</p>
                    </div>
                    <div className="text-right">
                        <p><span className="font-bold">Date:</span> {invoiceDate}</p>
                        <p><span className="font-bold">Due Date:</span> {dueDate}</p>
                    </div>
                </div>

                {/* Items Table */}
                <div className="space-y-2 mb-8">
                    <div className="grid grid-cols-12 gap-4 font-bold p-2 rounded-t-lg" style={{backgroundColor: accentColor, color: 'white'}}>
                        <div className="col-span-7">Description</div>
                        <div className="col-span-2 text-right">Quantity</div>
                        <div className="col-span-2 text-right">Price</div>
                        <div className="col-span-1 text-right"></div>
                    </div>
                     {items.map((item, index) => (
                        <div key={item.id} className="grid grid-cols-12 gap-4 items-center">
                            <div className="col-span-7">
                                <Textarea value={item.description} onChange={(e) => handleItemChange(item.id, 'description', e.target.value)} rows={1} className="w-full text-sm"/>
                            </div>
                            <div className="col-span-2">
                                <Input type="number" value={item.quantity} onChange={(e) => handleItemChange(item.id, 'quantity', Number(e.target.value))} className="w-full text-right"/>
                            </div>
                             <div className="col-span-2">
                                <Input type="number" value={item.price} onChange={(e) => handleItemChange(item.id, 'price', Number(e.target.value))} className="w-full text-right"/>
                            </div>
                            <div className="col-span-1 text-right">
                                <Button size="icon" variant="ghost" onClick={() => removeItem(item.id)} className="h-8 w-8 text-destructive"><Trash2 className="h-4 w-4"/></Button>
                            </div>
                        </div>
                    ))}
                    <Button onClick={addItem} size="sm" variant="secondary" className="mt-2"><Plus className="mr-2 h-4 w-4"/>Add Item</Button>
                </div>
                
                {/* Totals */}
                <div className="flex justify-end">
                    <div className="w-64 space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-gray-600">Subtotal</span>
                            <span className="font-medium">${subtotal.toFixed(2)}</span>
                        </div>
                         <div className="flex justify-between items-center">
                            <span className="text-gray-600">Tax (%)</span>
                            <Input type="number" value={tax} onChange={(e) => setTax(Number(e.target.value))} className="w-20 h-8 text-right"/>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Tax Amount</span>
                            <span className="font-medium">${taxAmount.toFixed(2)}</span>
                        </div>
                        <div className="border-t border-gray-300 my-2"></div>
                        <div className="flex justify-between font-bold text-lg" style={{ color: accentColor }}>
                            <span>Total</span>
                            <span>${total.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
              </div>
            </div>
        </div>
      </div>
    </div>
  );
}

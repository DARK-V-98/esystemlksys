
'use client';
import React, { useRef } from 'react';
import Image from 'next/image';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import type { BillItem } from '@/app/advanced-tools/bill-generator/page';
import { Download } from 'lucide-react';

interface BillPreviewDialogProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    billData: {
        logo: string | null;
        yourCompany: string;
        yourAddress: string;
        clientCompany: string;
        clientAddress: string;
        invoiceNumber: string;
        invoiceDate: string;
        dueDate: string;
        items: BillItem[];
        tax: number;
        accentColor: string;
        subtotal: number;
        taxAmount: number;
        total: number;
    }
}

export function BillPreviewDialog({ isOpen, setIsOpen, billData }: BillPreviewDialogProps) {
    const billPreviewRef = useRef<HTMLDivElement>(null);
    const {
        logo,
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
    } = billData;
    
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


    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="max-w-4xl h-[90vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle>Invoice Preview</DialogTitle>
                    <DialogDescription>
                        Review your invoice before downloading.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex-grow overflow-auto p-2 bg-muted/50 rounded-lg">
                    <div ref={billPreviewRef} className="relative p-8 bg-white text-black shadow-lg w-[8.5in] min-h-[11in] mx-auto">
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
                        <table className="w-full border-collapse mb-8 text-sm">
                            <thead>
                                <tr style={{backgroundColor: accentColor, color: 'white'}}>
                                    <th className="p-2 text-left font-bold w-[60%]">Description</th>
                                    <th className="p-2 text-right font-bold">Quantity</th>
                                    <th className="p-2 text-right font-bold">Price</th>
                                    <th className="p-2 text-right font-bold">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.map((item) => (
                                    <tr key={item.id} className="border-b">
                                        <td className="p-2">{item.description}</td>
                                        <td className="p-2 text-right">{item.quantity}</td>
                                        <td className="p-2 text-right">${item.price.toFixed(2)}</td>
                                        <td className="p-2 text-right">${(item.quantity * item.price).toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        
                        {/* Totals */}
                        <div className="flex justify-end">
                            <div className="w-64 space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Subtotal</span>
                                    <span className="font-medium">${subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Tax ({tax}%)</span>
                                    <span className="font-medium">${taxAmount.toFixed(2)}</span>
                                </div>
                                <div className="border-t border-gray-300 my-2"></div>
                                <div className="flex justify-between font-bold text-lg" style={{ color: accentColor }}>
                                    <span>Total</span>
                                    <span>${total.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                        <div className="absolute bottom-4 left-0 right-0 text-center text-xs text-gray-400">
                            Generated by ESYSTEMLK Invoice Generator
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <Button type="button" variant="secondary" onClick={() => setIsOpen(false)}>Close</Button>
                    <Button onClick={downloadPDF} variant="gradient">
                        <Download className="mr-2 h-4 w-4"/>
                        Download PDF
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

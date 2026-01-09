'use client'
import React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface LetterheadProps {
    companyName: string;
    companyAddress: string;
    logo: string | null;
    letterContent: string;
    accentColor: string;
}

const Classic: React.FC<LetterheadProps> = ({ companyName, companyAddress, logo, letterContent, accentColor }) => (
    <div className="p-12 font-serif text-sm">
        <header className="text-center mb-12">
            {logo && <Image src={logo} alt="logo" width={80} height={80} className="mx-auto mb-4 object-contain" />}
            <h1 className="text-3xl font-bold" style={{ color: accentColor }}>{companyName}</h1>
            <p className="text-xs whitespace-pre-line text-gray-600 mt-2">{companyAddress}</p>
        </header>
        <main className="whitespace-pre-wrap text-gray-800 leading-relaxed">
            {letterContent}
        </main>
    </div>
);

const Modern: React.FC<LetterheadProps> = ({ companyName, companyAddress, logo, letterContent, accentColor }) => (
    <div className="flex h-full font-sans text-sm">
        <div className="w-1/4 p-8" style={{ backgroundColor: accentColor }}>
            {logo && <Image src={logo} alt="logo" width={60} height={60} className="mb-8 object-contain" />}
            <h2 className="text-2xl font-bold text-white mb-2">{companyName}</h2>
            <p className="text-xs whitespace-pre-line text-white/80">{companyAddress}</p>
        </div>
        <div className="w-3/4 p-12">
            <main className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                {letterContent}
            </main>
        </div>
    </div>
);

const Minimalist: React.FC<LetterheadProps> = ({ companyName, companyAddress, logo, letterContent, accentColor }) => (
    <div className="p-12 font-sans text-sm relative h-full">
        <header className="flex justify-between items-start mb-12">
            <div>
                <h1 className="text-xl font-bold">{companyName}</h1>
            </div>
            <div className="text-right">
                <p className="text-xs whitespace-pre-line text-gray-500">{companyAddress}</p>
            </div>
        </header>
        <main className="whitespace-pre-wrap text-gray-800 leading-relaxed">
            {letterContent}
        </main>
        <div className="absolute bottom-12 left-12 right-12 h-px" style={{ backgroundColor: accentColor }}></div>
    </div>
);

const Corporate: React.FC<LetterheadProps> = ({ companyName, companyAddress, logo, letterContent, accentColor }) => (
    <div className="p-12 font-sans text-sm relative h-full">
        <header className="flex items-center gap-4 mb-12 border-b-2 pb-4" style={{ borderColor: accentColor }}>
             {logo && <Image src={logo} alt="logo" width={50} height={50} className="object-contain" />}
             <div>
                <h1 className="text-2xl font-bold text-gray-800">{companyName}</h1>
             </div>
        </header>
        <main className="whitespace-pre-wrap text-gray-700 leading-relaxed">
            {letterContent}
        </main>
        <footer className="absolute bottom-8 left-12 right-12 text-center text-xs text-gray-500 whitespace-pre-line">
            {companyAddress}
        </footer>
    </div>
);

const Creative: React.FC<LetterheadProps> = ({ companyName, companyAddress, logo, letterContent, accentColor }) => (
    <div className="p-12 font-sans text-sm relative h-full bg-gray-50">
        <div className="absolute top-0 left-0 w-3 h-full" style={{backgroundColor: accentColor}}></div>
        <div className="absolute top-0 right-0 w-24 h-24" style={{clipPath: 'polygon(100% 0, 0 0, 100% 100%)', backgroundColor: accentColor, opacity: 0.8}}></div>
        <header className="mb-12">
            {logo && <Image src={logo} alt="logo" width={60} height={60} className="mb-4 object-contain" />}
            <h1 className="text-3xl font-extrabold text-gray-800">{companyName}</h1>
        </header>
        <main className="whitespace-pre-wrap text-gray-700 leading-relaxed mb-12">
            {letterContent}
        </main>
        <footer className="text-right text-xs text-gray-500 whitespace-pre-line">
            {companyAddress}
        </footer>
    </div>
);

const Elegant: React.FC<LetterheadProps> = ({ companyName, companyAddress, logo, letterContent, accentColor }) => (
  <div className="p-16 font-serif text-sm text-center relative h-full">
    <div className="absolute top-8 left-8 right-8 h-px bg-gray-300"></div>
    <div className="absolute bottom-8 left-8 right-8 h-px bg-gray-300"></div>
    <header className="my-8">
        <h1 className="text-4xl font-thin tracking-widest uppercase" style={{color: accentColor}}>{companyName}</h1>
    </header>
    <main className="whitespace-pre-wrap text-gray-700 leading-relaxed text-left my-16">
        {letterContent}
    </main>
    <footer className="text-xs text-gray-400 whitespace-pre-line">
        {companyAddress}
    </footer>
  </div>
);

const Geometric: React.FC<LetterheadProps> = ({ companyName, companyAddress, logo, letterContent, accentColor }) => (
    <div className="p-12 font-sans text-sm relative h-full overflow-hidden">
        <div className="absolute -top-16 -left-16 w-48 h-48 rounded-full" style={{backgroundColor: accentColor, opacity: 0.1}}></div>
        <div className="absolute -bottom-16 -right-16 w-48 h-48" style={{border: `20px solid ${accentColor}`, opacity: 0.1}}></div>
        <header className="flex items-center justify-between mb-12">
            {logo && <Image src={logo} alt="logo" width={50} height={50} className="object-contain z-10" />}
            <h1 className="text-2xl font-bold z-10">{companyName}</h1>
        </header>
        <main className="whitespace-pre-wrap text-gray-800 leading-relaxed z-10 relative">
            {letterContent}
        </main>
        <footer className="absolute bottom-12 right-12 text-xs text-gray-500 text-right whitespace-pre-line z-10">
            {companyAddress}
        </footer>
    </div>
);

const Bold: React.FC<LetterheadProps> = ({ companyName, companyAddress, logo, letterContent, accentColor }) => (
    <div className="relative h-full font-sans text-sm">
        <header className="p-8 text-white" style={{backgroundColor: accentColor}}>
            <div className="flex justify-between items-center">
                <h1 className="text-4xl font-black">{companyName}</h1>
                {logo && <Image src={logo} alt="logo" width={60} height={60} className="object-contain" />}
            </div>
        </header>
        <main className="p-12 whitespace-pre-wrap text-gray-700 leading-relaxed">
            {letterContent}
        </main>
        <footer className="absolute bottom-0 left-0 right-0 p-4 text-center text-xs text-white/80" style={{backgroundColor: accentColor}}>
             <p className="whitespace-pre-line">{companyAddress}</p>
        </footer>
    </div>
);

const SimpleHeader: React.FC<LetterheadProps> = ({ companyName, companyAddress, logo, letterContent, accentColor }) => (
    <div className="p-12 font-sans text-sm">
        <header className="border-b pb-4 mb-8">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                    {logo && <Image src={logo} alt="logo" width={40} height={40} className="object-contain" />}
                    <h1 className="text-xl font-semibold" style={{color: accentColor}}>{companyName}</h1>
                </div>
                <p className="text-xs whitespace-pre-line text-right text-gray-500">{companyAddress}</p>
            </div>
        </header>
        <main className="whitespace-pre-wrap text-gray-800 leading-relaxed">
            {letterContent}
        </main>
    </div>
);

const SimpleFooter: React.FC<LetterheadProps> = ({ companyName, companyAddress, logo, letterContent, accentColor }) => (
    <div className="p-12 font-sans text-sm flex flex-col h-full">
        <header className="mb-8">
            <h1 className="text-2xl font-bold">{companyName}</h1>
        </header>
        <main className="flex-grow whitespace-pre-wrap text-gray-800 leading-relaxed">
            {letterContent}
        </main>
        <footer className="border-t pt-4 mt-8">
            <div className="flex justify-between items-center">
                {logo && <Image src={logo} alt="logo" width={40} height={40} className="object-contain" />}
                <p className="text-xs whitespace-pre-line text-right text-gray-500">{companyAddress}</p>
            </div>
        </footer>
    </div>
);


export const letterheadDesigns = [
    { name: 'Classic', component: Classic },
    { name: 'Modern', component: Modern },
    { name: 'Minimalist', component: Minimalist },
    { name: 'Corporate', component: Corporate },
    { name: 'Creative', component: Creative },
    { name: 'Elegant', component: Elegant },
    { name: 'Geometric', component: Geometric },
    { name: 'Bold', component: Bold },
    { name: 'Simple Header', component: SimpleHeader },
    { name: 'Simple Footer', component: SimpleFooter },
];

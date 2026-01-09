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
    <div className="p-12 font-serif text-sm flex flex-col h-full bg-white">
        <header className="text-center mb-12">
            {logo && <Image src={logo} alt="logo" width={80} height={80} className="mx-auto mb-4 object-contain" />}
            <h1 className="text-3xl font-bold tracking-wider" style={{ color: accentColor }}>{companyName.toUpperCase()}</h1>
            <p className="text-xs whitespace-pre-line text-gray-500 mt-2">{companyAddress}</p>
        </header>
        <main className="flex-grow whitespace-pre-wrap text-gray-800 leading-relaxed text-justify">
            {letterContent}
        </main>
        <footer className="mt-12 pt-4 border-t-2" style={{borderColor: accentColor}}>
            <p className="text-center text-xs text-gray-500">
                Thank you for your business.
            </p>
        </footer>
    </div>
);

const Modern: React.FC<LetterheadProps> = ({ companyName, companyAddress, logo, letterContent, accentColor }) => (
    <div className="flex h-full font-sans text-sm bg-white">
        <div className="w-24 p-8 flex flex-col justify-between items-center" style={{ backgroundColor: accentColor }}>
            {logo ? (
                 <Image src={logo} alt="logo" width={48} height={48} className="object-contain" />
            ) : (
                <div className="w-12 h-12 bg-white/20 rounded-lg"></div>
            )}
            <div className="-rotate-90 whitespace-nowrap text-white/50 tracking-widest text-xs uppercase">
                {companyName}
            </div>
        </div>
        <div className="flex-1 p-12 flex flex-col">
            <header className="mb-12 text-right">
                <h1 className="text-4xl font-extrabold text-gray-800">{companyName}</h1>
                <p className="text-xs whitespace-pre-line text-gray-500 mt-1">{companyAddress}</p>
            </header>
            <main className="flex-grow whitespace-pre-wrap text-gray-700 leading-loose">
                {letterContent}
            </main>
        </div>
    </div>
);

const Minimalist: React.FC<LetterheadProps> = ({ companyName, companyAddress, logo, letterContent, accentColor }) => (
    <div className="p-12 font-sans text-sm relative h-full flex flex-col bg-white">
        <header className="flex justify-between items-start mb-16">
            <h1 className="text-xl font-bold tracking-widest" style={{color: accentColor}}>{companyName.toUpperCase()}</h1>
            {logo && <Image src={logo} alt="logo" width={40} height={40} className="object-contain opacity-70" />}
        </header>
        <main className="flex-grow whitespace-pre-wrap text-gray-800 leading-relaxed">
            {letterContent}
        </main>
        <footer className="mt-16 text-right">
            <p className="text-xs whitespace-pre-line text-gray-400">{companyAddress}</p>
        </footer>
    </div>
);

const Corporate: React.FC<LetterheadProps> = ({ companyName, companyAddress, logo, letterContent, accentColor }) => (
    <div className="p-12 font-sans text-sm relative h-full flex flex-col bg-white">
        <header className="flex items-center gap-6 mb-12">
             {logo && <Image src={logo} alt="logo" width={60} height={60} className="object-contain rounded-md" />}
             <div>
                <h1 className="text-3xl font-bold text-gray-800">{companyName}</h1>
                <div className="h-1 w-20 mt-2" style={{backgroundColor: accentColor}}></div>
             </div>
        </header>
        <main className="flex-grow whitespace-pre-wrap text-gray-700 leading-relaxed">
            {letterContent}
        </main>
        <footer className="absolute bottom-0 left-0 right-0 h-4" style={{backgroundColor: accentColor}}>
             <p className="absolute right-12 -top-6 text-xs text-gray-500 whitespace-pre-line">{companyAddress}</p>
        </footer>
    </div>
);

const Creative: React.FC<LetterheadProps> = ({ companyName, companyAddress, logo, letterContent, accentColor }) => (
    <div className="p-12 font-sans text-sm relative h-full bg-gray-50/50 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-24" style={{backgroundColor: accentColor, clipPath: 'polygon(0 0, 100% 0, 100% 40%, 0% 100%)'}}></div>
        <header className="mb-12 z-10 relative pt-4">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-extrabold text-white">{companyName}</h1>
                {logo && <div className="p-2 bg-white rounded-full shadow-lg"><Image src={logo} alt="logo" width={48} height={48} className="object-contain"/></div>}
            </div>
        </header>
        <main className="whitespace-pre-wrap text-gray-700 leading-relaxed mb-12 z-10 relative">
            {letterContent}
        </main>
        <footer className="absolute bottom-12 right-12 text-right text-xs text-gray-500 whitespace-pre-line z-10">
            {companyAddress}
        </footer>
    </div>
);

const Elegant: React.FC<LetterheadProps> = ({ companyName, companyAddress, logo, letterContent, accentColor }) => (
  <div className="p-16 font-serif text-sm text-center relative h-full flex flex-col bg-white">
    <div className="absolute top-8 left-8 right-8 h-px bg-gray-200"></div>
    <div className="absolute bottom-8 left-8 right-8 h-px bg-gray-200"></div>
    <header className="my-8 flex-shrink-0">
        {logo && <Image src={logo} alt="logo" width={50} height={50} className="mx-auto mb-4 object-contain" />}
        <h1 className="text-3xl font-thin tracking-[0.2em] uppercase" style={{color: accentColor}}>{companyName}</h1>
    </header>
    <main className="flex-grow whitespace-pre-wrap text-gray-600 leading-loose text-left my-12 text-xs">
        {letterContent}
    </main>
    <footer className="text-xs text-gray-400 whitespace-pre-line flex-shrink-0">
        {companyAddress.split('\n').join(' | ')}
    </footer>
  </div>
);

const Geometric: React.FC<LetterheadProps> = ({ companyName, companyAddress, logo, letterContent, accentColor }) => (
    <div className="p-12 font-sans text-sm relative h-full overflow-hidden bg-white">
        <div className="absolute -top-24 -left-24 w-60 h-60 border-[20px] rounded-full" style={{borderColor: accentColor, opacity: 0.1}}></div>
        <div className="absolute -bottom-24 -right-24 w-60 h-60 bg-gray-100 rotate-45"></div>
        <header className="flex items-start justify-between mb-12 z-10 relative">
            <div>
                <h1 className="text-4xl font-black text-gray-800" style={{color: accentColor}}>{companyName}</h1>
                <p className="text-xs whitespace-pre-line text-gray-500 mt-2">{companyAddress}</p>
            </div>
            {logo && <Image src={logo} alt="logo" width={60} height={60} className="object-contain z-10" />}
        </header>
        <main className="whitespace-pre-wrap text-gray-800 leading-relaxed z-10 relative">
            {letterContent}
        </main>
    </div>
);

const Bold: React.FC<LetterheadProps> = ({ companyName, companyAddress, logo, letterContent, accentColor }) => (
    <div className="relative h-full font-sans text-sm flex flex-col bg-white">
        <header className="p-8 text-white" style={{backgroundColor: accentColor}}>
            <div className="flex justify-between items-center">
                <h1 className="text-4xl font-black tracking-tighter">{companyName}</h1>
                {logo && <div className="bg-white/20 p-2 rounded-md"><Image src={logo} alt="logo" width={48} height={48} className="object-contain" /></div>}
            </div>
        </header>
        <main className="p-12 flex-grow whitespace-pre-wrap text-gray-700 leading-relaxed">
            {letterContent}
        </main>
        <footer className="p-4 text-center text-xs" style={{backgroundColor: '#f1f5f9'}}>
             <p className="whitespace-pre-line text-gray-500">{companyAddress}</p>
        </footer>
    </div>
);

const SimpleHeader: React.FC<LetterheadProps> = ({ companyName, companyAddress, logo, letterContent, accentColor }) => (
    <div className="p-12 font-sans text-sm bg-white h-full flex flex-col">
        <header className="border-b-4 pb-4 mb-8" style={{borderColor: accentColor}}>
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                    {logo && <Image src={logo} alt="logo" width={40} height={40} className="object-contain" />}
                    <h1 className="text-2xl font-bold text-gray-800">{companyName}</h1>
                </div>
                <p className="text-xs whitespace-pre-line text-right text-gray-500">{companyAddress}</p>
            </div>
        </header>
        <main className="flex-grow whitespace-pre-wrap text-gray-800 leading-relaxed">
            {letterContent}
        </main>
    </div>
);

const SimpleFooter: React.FC<LetterheadProps> = ({ companyName, companyAddress, logo, letterContent, accentColor }) => (
    <div className="p-12 font-sans text-sm flex flex-col h-full bg-white">
        <header className="mb-8 flex justify-between items-center">
            {logo && <Image src={logo} alt="logo" width={50} height={50} className="object-contain" />}
            <h1 className="text-2xl font-semibold text-right text-gray-700">{companyName}</h1>
        </header>
        <main className="flex-grow whitespace-pre-wrap text-gray-800 leading-relaxed">
            {letterContent}
        </main>
        <footer className="border-t-4 pt-4 mt-8" style={{borderColor: accentColor}}>
            <p className="text-xs whitespace-pre-line text-center text-gray-500">{companyAddress}</p>
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

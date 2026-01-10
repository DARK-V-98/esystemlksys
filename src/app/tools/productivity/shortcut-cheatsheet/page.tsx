'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Keyboard, Search } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const shortcutsData: Record<string, {name: string, shortcuts: Record<string, string>}[]> = {
  "General": [{
    name: "Basic Editing",
    shortcuts: {
        "Ctrl/Cmd + C": "Copy",
        "Ctrl/Cmd + X": "Cut",
        "Ctrl/Cmd + V": "Paste",
        "Ctrl/Cmd + Z": "Undo",
        "Ctrl/Cmd + Y": "Redo",
        "Ctrl/Cmd + A": "Select All",
        "Ctrl/Cmd + S": "Save",
    }
  }],
  "VS Code": [{
    name: "Basic Editing",
    shortcuts: {
      "Ctrl/Cmd + X": "Cut line",
      "Ctrl/Cmd + C": "Copy line",
      "Ctrl/Cmd + Enter": "Insert line below",
      "Ctrl/Cmd + Shift + K": "Delete line",
      "Alt + Up/Down": "Move line up/down",
    }
  }, {
    name: "Navigation",
    shortcuts: {
      "Ctrl/Cmd + P": "Go to File",
      "Ctrl/Cmd + Shift + O": "Go to Symbol",
      "F12": "Go to Definition",
      "Ctrl/Cmd + G": "Go to Line",
    }
  }],
  "Figma": [{
    name: "Tools",
    shortcuts: {
      "V": "Move tool",
      "F": "Frame tool",
      "R": "Rectangle tool",
      "O": "Ellipse tool",
      "T": "Text tool",
      "P": "Pen tool",
    }
  }, {
    name: "Zoom",
    shortcuts: {
      "Shift + 1": "Zoom to fit",
      "Shift + 2": "Zoom to selection",
      "Ctrl/Cmd + '+'": "Zoom in",
      "Ctrl/Cmd + '-'": "Zoom out",
    }
  }]
};

export default function ShortcutCheatsheetPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredData = Object.entries(shortcutsData).map(([category, sections]) => {
    const filteredSections = sections.map(section => {
      const filteredShortcuts = Object.entries(section.shortcuts).filter(([shortcut, description]) => 
        shortcut.toLowerCase().includes(searchQuery.toLowerCase()) || description.toLowerCase().includes(searchQuery.toLowerCase())
      );
      return { ...section, shortcuts: Object.fromEntries(filteredShortcuts) };
    }).filter(section => Object.keys(section.shortcuts).length > 0);
    
    return { category, sections: filteredSections };
  }).filter(cat => cat.sections.length > 0);

  return (
    <div className="space-y-6 animate-fade-in p-8">
      <div className="relative overflow-hidden gradient-dark p-8">
        <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-primary/20 blur-3xl" />
        <div className="relative flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl gradient-primary shadow-glow-intense">
            <Keyboard className="h-8 w-8 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-primary-foreground">
              Shortcut <span className="text-primary neon-text">Cheatsheet</span>
            </h1>
            <p className="mt-1 text-primary-foreground/70">
              A quick reference for common keyboard shortcuts.
            </p>
          </div>
        </div>
      </div>
      
      <div className="bg-card rounded-lg border shadow-sm p-6 space-y-6">
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <Link href="/tools" className="inline-flex items-center justify-center gap-2 rounded-xl h-12 px-5 text-sm font-bold transition-all duration-200 bg-secondary text-secondary-foreground hover:bg-secondary/80 hover:text-primary">
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Tools</span>
          </Link>
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input placeholder="Search shortcuts..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-10 h-12" />
          </div>
        </div>
        
        <div className="space-y-8">
          {filteredData.map(({ category, sections }) => (
            <div key={category}>
              <h2 className="text-2xl font-bold mb-4">{category}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sections.map(section => (
                  <Card key={section.name}>
                    <CardHeader><CardTitle>{section.name}</CardTitle></CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm">
                        {Object.entries(section.shortcuts).map(([shortcut, description]) => (
                          <li key={shortcut} className="flex justify-between">
                            <span className="text-muted-foreground">{description}</span>
                            <kbd className="px-2 py-1.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500">{shortcut}</kbd>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

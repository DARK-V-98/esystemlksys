'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, BookCopy, Plus, Trash2, Edit, Clipboard, Search } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

interface Snippet {
  id: number;
  title: string;
  code: string;
  language: string;
}

export default function SnippetManagerPage() {
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [selectedSnippet, setSelectedSnippet] = useState<Snippet | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSnippet, setEditingSnippet] = useState<Snippet | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    try {
      const savedSnippets = localStorage.getItem('codeSnippets');
      if (savedSnippets) {
        setSnippets(JSON.parse(savedSnippets));
      }
    } catch (e) {
      console.error("Failed to load snippets from local storage", e);
    }
  }, []);

  useEffect(() => {
    try {
        localStorage.setItem('codeSnippets', JSON.stringify(snippets));
    } catch (e) {
        console.error("Failed to save snippets to local storage", e);
    }
  }, [snippets]);
  
  const handleSaveSnippet = (title: string, code: string, language: string) => {
    if (editingSnippet) {
      setSnippets(snippets.map(s => s.id === editingSnippet.id ? { ...s, title, code, language } : s));
      toast.success("Snippet updated!");
    } else {
      const newSnippet: Snippet = { id: Date.now(), title, code, language };
      setSnippets([...snippets, newSnippet]);
      toast.success("Snippet saved!");
    }
    setIsFormOpen(false);
    setEditingSnippet(null);
  };

  const deleteSnippet = (id: number) => {
    setSnippets(snippets.filter(s => s.id !== id));
    if(selectedSnippet?.id === id) setSelectedSnippet(null);
    toast.error("Snippet deleted.");
  };
  
  const filteredSnippets = snippets.filter(s => s.title.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="space-y-6 animate-fade-in p-8">
      <div className="relative overflow-hidden gradient-dark p-8">
        <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-primary/20 blur-3xl" />
        <div className="relative flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl gradient-primary shadow-glow-intense">
            <BookCopy className="h-8 w-8 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-primary-foreground">
              Snippet <span className="text-primary neon-text">Manager</span>
            </h1>
            <p className="mt-1 text-primary-foreground/70">
              Save and organize your reusable code snippets.
            </p>
          </div>
        </div>
      </div>
      
      <div className="bg-card rounded-lg border shadow-sm p-6 space-y-6">
        <Link href="/tools" className="inline-flex items-center justify-center gap-2 rounded-xl h-12 px-5 text-sm font-bold transition-all duration-200 bg-secondary text-secondary-foreground hover:bg-secondary/80 hover:text-primary">
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Tools</span>
        </Link>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[65vh]">
          <div className="md:col-span-1 flex flex-col gap-4">
            <div className="flex gap-2">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"/>
                <Input placeholder="Search snippets..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-9"/>
              </div>
              <Button onClick={() => { setEditingSnippet(null); setIsFormOpen(true); }}><Plus className="mr-2 h-4 w-4"/> New</Button>
            </div>
            <div className="flex-grow bg-secondary/30 border rounded-lg overflow-auto p-2 space-y-2">
              {filteredSnippets.map(s => (
                <div key={s.id} onClick={() => setSelectedSnippet(s)} className={`p-3 rounded-md cursor-pointer ${selectedSnippet?.id === s.id ? 'bg-primary/20' : 'hover:bg-muted'}`}>
                  <p className="font-semibold truncate">{s.title}</p>
                  <p className="text-xs text-muted-foreground">{s.language}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="md:col-span-2 bg-secondary/50 border rounded-lg p-4 flex flex-col">
            {selectedSnippet ? (
              <>
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <h3 className="text-xl font-bold">{selectedSnippet.title}</h3>
                    <p className="text-sm text-muted-foreground">{selectedSnippet.language}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={() => { setEditingSnippet(selectedSnippet); setIsFormOpen(true); }}><Edit className="h-4 w-4"/></Button>
                    <Button variant="ghost" size="icon" onClick={() => deleteSnippet(selectedSnippet.id)}><Trash2 className="h-4 w-4 text-destructive"/></Button>
                    <Button variant="ghost" size="icon" onClick={() => {navigator.clipboard.writeText(selectedSnippet.code); toast.success("Copied to clipboard!");}}><Clipboard className="h-4 w-4"/></Button>
                  </div>
                </div>
                <pre className="flex-grow bg-background p-4 rounded-md text-sm font-mono overflow-auto">
                  <code>{selectedSnippet.code}</code>
                </pre>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                <BookCopy className="h-16 w-16 mb-4"/>
                <p>Select a snippet to view or create a new one.</p>
              </div>
            )}
          </div>
        </div>
      </div>
      <SnippetForm isOpen={isFormOpen} setIsOpen={setIsFormOpen} onSave={handleSaveSnippet} snippet={editingSnippet} />
    </div>
  );
}

function SnippetForm({ isOpen, setIsOpen, onSave, snippet }: { isOpen: boolean, setIsOpen: (o:boolean)=>void, onSave: (t:string,c:string,l:string)=>void, snippet: Snippet | null}) {
  const [title, setTitle] = useState('');
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('');

  useEffect(() => {
    if (snippet) {
      setTitle(snippet.title);
      setCode(snippet.code);
      setLanguage(snippet.language);
    } else {
      setTitle(''); setCode(''); setLanguage('');
    }
  }, [snippet, isOpen]);

  const handleSubmit = () => {
    if(!title || !code) {
      toast.error("Title and code cannot be empty.");
      return;
    }
    onSave(title, code, language);
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{snippet ? 'Edit Snippet' : 'New Snippet'}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <Input placeholder="Title (e.g., 'React Button Component')" value={title} onChange={e => setTitle(e.target.value)} />
          <Input placeholder="Language (e.g., 'JavaScript')" value={language} onChange={e => setLanguage(e.target.value)} />
          <Textarea placeholder="Your code snippet here..." value={code} onChange={e => setCode(e.target.value)} className="min-h-[200px] font-mono"/>
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

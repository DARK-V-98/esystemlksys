'use client';
import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, FileText } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import ReactMarkdown from 'react-markdown';

const initialMarkdown = `# Markdown Preview
## Write on the left, see the result on the right.

- Supports lists
- **Bold** and *italic* text
- \`inline code\`
- [links](https://www.esystemlk.xyz)

> Blockquotes are also supported.

\`\`\`javascript
// Code blocks
function helloWorld() {
  console.log("Hello, world!");
}
\`\`\`
`;

export default function MarkdownPreviewPage() {
  const [markdown, setMarkdown] = useState(initialMarkdown);

  return (
    <div className="space-y-6 animate-fade-in p-8">
      <div className="relative overflow-hidden gradient-dark p-8">
        <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-primary/20 blur-3xl" />
        <div className="relative flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl gradient-primary shadow-glow-intense">
            <FileText className="h-8 w-8 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-primary-foreground">
              Markdown <span className="text-primary neon-text">Preview</span>
            </h1>
            <p className="mt-1 text-primary-foreground/70">
              Write Markdown and see a live preview.
            </p>
          </div>
        </div>
      </div>
      
      <div className="bg-card rounded-lg border shadow-sm p-6 space-y-6">
        <Link href="/tools" className="inline-flex items-center justify-center gap-2 rounded-xl h-12 px-5 text-sm font-bold transition-all duration-200 bg-secondary text-secondary-foreground hover:bg-secondary/80 hover:text-primary">
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Tools</span>
        </Link>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 min-h-[60vh]">
            <Textarea
                placeholder="Enter Markdown here..."
                value={markdown}
                onChange={(e) => setMarkdown(e.target.value)}
                className="h-full text-base font-mono resize-none"
            />
            <div className="prose dark:prose-invert prose-lg bg-secondary/50 border rounded-lg p-6 overflow-auto">
                <ReactMarkdown>{markdown}</ReactMarkdown>
            </div>
        </div>
      </div>
    </div>
  );
}
